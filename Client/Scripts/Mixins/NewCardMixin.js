App.NewCardMixin = Ember.Mixin.create({
  typesRaw:[{title:'Documents',id:'Documents'},{title:'Image',id:'Image'},{title:'List',id:'List'},{title:'Properties',id:'Properties'},{title:'Text_Area',id:'Text_Area'},{title:'Titled_Notes',id:'Titled_Notes'}],
  // typesRaw:[{{#plugins}}{title:'{{name}}',id:'{{name}}'},{{/plugins}}],
  actions:{
    NewCard:function(){
      var typesRaw = this.get('typesRaw');
      var context = this;
      new Promise(function(resolve, reject){
        var xhr = new XMLHttpRequest();

        xhr.open('GET',  window.AppSettings.WebserviceURL+'/templates');
        xhr.onreadystatechange = handler;
        xhr.responseType = 'json';
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send();
        function handler() {
          if (this.readyState === this.DONE) {
            if (this.status === 200) {
              resolve(Ember.A(this.response.templates));
            }
          }
        }
      }).then(this.OnTemplates(typesRaw,null,context));
      return false;
    },
    NewCardConfirm:function(){
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
      context.SetParent(card,content.parent,content.embedded).then(function(card){
      });
    });
  },
  OnTemplates:function(typesRaw,parentCard,context){
    var f = function(templates){
      var types =typesRaw.concat(templates);
      var content= {types:types};//parent embedded
      var parent =null;
      if(context.GetParent){
        parent = context.GetParent();
      }
      if(parent){
        content.onMainDisplay = false;
        content.parent = parent;
        content.embedded = context.get('isMain') ? false : true;
      }else{
        content.onMainDisplay = true;
        content.parent = null;
      }
      content.tags =[];
      context.set('modal',Ember.Widgets.ModalComponent.popup({
        targetObject: context,
        confirm: "NewCardConfirm",
        // cancel: "BaseModalCancel",
        content: content,
        contentViewClass:Ember.View.extend({
          templateName:'popups/cardForm',
        }),
        headerText:'New Card'
      }));
    }
    f.typesRaw = typesRaw;
    return f
  },
  Save:function(card){
    var promise = card.save();
    var context = this;
    promise.then(
      function(card){
        context.Notify('Card saved','success')
      },
      function(error){
        context.Notify('Card couldnt be saved','danger')
      }
    );
  },
  SetParent:function(card,parentCard,embedded){
    var context = this;
    return new Promise(function(resolve, reject) {
      if(parentCard){
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
                     context.Notify('Card saved','success')
                    resolve(card);
                  });
                });
              },function(error){context.OnError.call(context,error)});
            });
          });
        })
      }else{
        context.Save.call(context,card);
        resolve(card);
      }
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
    this.Notify('Card couldnt be saved','danger')
    this.CleanUp();
  },
  GetNewCard:function(onMainDisplay,parent,qTags){
    var context = this;
    return new Promise(function(resolve, reject) {
      var cardPackage = {}
      var card = context.store.createRecord('card', {
        left:0,
        top:0,
        tagsIn : qTags,//tags
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
