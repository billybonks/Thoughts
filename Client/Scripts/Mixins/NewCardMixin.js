App.NewCardMixin = Ember.Mixin.create({
  typesRaw:[{title:'Documents',id:'Documents'},{title:'Image',id:'Image'},{title:'List',id:'List'},{title:'Properties',id:'Properties'},{title:'Text_Area',id:'Text_Area'},{title:'Titled_Notes',id:'Titled_Notes'}],
  // typesRaw:[{{#plugins}}{title:'{{name}}',id:'{{name}}'},{{/plugins}}],
  actions:{
    NewCard:function(){
      var typesRaw = this.get('typesRaw');
      var context = this;
      var templates = this.store.all('template')
      var types =typesRaw.concat(templates);
      var content= {types:types};
      context.GetParent().then(function(parent){
        if(parent){
          content.parent = parent;
          content.embedded = context.embedded();
          var parentSelect = {id:1,name:parent.get('title'),value:true}
          content.parentSelection = [parentSelect,{id:0,name:'none',value:false}]

        }else{
          content.parent = null;
        }
        content.tags =[];
        context.set('modal',Ember.Widgets.ModalComponent.popup({
          targetObject: context,
          confirm: "NewCardConfirm",
          // cancel: "BaseModalCancel",
          content: content,
          contentViewClass:Ember.View.extend({
            templateName:'popups/cardForm'
          }),
          headerText:'New Card'
        }));
      })
    },
    NewCardConfirm:function(){
      var model = this.get('modal.content')
      var remainingTag = model.tagger.getCurrentVal();
      if(remainingTag.length > 0){
        model.tags.push(remainingTag);
      }
      delete model.tagger;
      this.get('SubmitCard').call(this,this.get('modal.content'));
    },
    tagAdded:function(item){
      this.tags[item] = item;
    },
    tagRemoved:function(item){
      delete this.tags[item];
    },
  },
  SubmitCard: function(content){
    var context = this;

    var title = content.title
    if(title ==='' || typeof title === 'undefined'){
      return;
    }
    this.GetNewCard(content.onMainDisplay,content.parent,content.tags).then(function(cardPackage){
      var card = cardPackage.card;
      var tags = cardPackage.tags;
      var position = cardPackage.position;
      card.set('title',title);
      card.set('type',content.selectedType);
      var promise;
      if(content.includeParent){
        promise = context.SetParent(card,content.parent,content.embedded);
      }else{
        promise = card.save();
      }
      promise.then(function(card){
        Bootstrap.NM.push('New card created', 'success');
        if(context.onCardAdded){
          context.onCardAdded(card);
        }else{
          context.sendAction('newCard',card)
        }
      },function(error){
        Bootstrap.NM.push('Error creating new card', 'danger');
      });
    });
  },
  SetParent:function(card,parentCard,embedded){
    var context = this;
    return new Promise(function(resolve, reject) {
        parentCard.get('children').then(function(children){
          var position = (children.get('length')+1);
          card.get('parents').then(function(parents){
            context.store.find('card',parentCard.get('id')).then(function(parentCard){
              parents.pushObject(parentCard);
              card.save().then(function(card){
                children.pushObject(card);
                var configuration = context.store.createRecord('configuration',{
                  position: position,
                  embedded: embedded,
                  'for':parentCard.get('id'),
                  configures:card
                });
                configuration.save().then(function(configuration){
                  card.get('configurations').then(function(configurations){
                    configurations.pushObject(configuration);
                    context.sendAction('Notify','Card saved','success')
                    resolve(card);
                  });
                });
              },function(error){context.OnError.call(context,error)});
            });
          });
        })
    });
  },
  SetTags:function(card,qTags){
    var context  = this;
    return new Promise(function(resolve,reject){
      context.store.find('tag',{names:qTags}).then(function(result){
        card.get('tags').then(function(tags){
          tags.pushObjects(result);
          resolve();
        })
      },function(error){context.OnError.call(context,error)});
    });
  },
  OnError:function(error){
    context.sendAction('Notify','Card couldnt be saved','danger')
  //  this.Notify('Card couldnt be saved','danger')
    this.CleanUp();
  },
  GetNewCard:function(onMainDisplay,parent,qTags){
    var context = this;
    return new Promise(function(resolve, reject) {
      var cardPackage = {}
      var card = context.store.createRecord('card', {
        left:0,
        top:0,
        onMainDisplay:onMainDisplay,
      });
      cardPackage.parent = parent;
      cardPackage.card = card;
      context.SetTags.call(context,card,qTags).then(function(){
        resolve(cardPackage);
      });
    });
  },
})
