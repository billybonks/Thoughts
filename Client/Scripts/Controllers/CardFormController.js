'use strict';
App.CardFormController = Ember.ObjectController.extend(App.PopupMixin,App.OnErrorMixin,{
  title:null,
  description:null,
  store: null,
  tags:{},
  selectedTemplate:-1,
  typesRaw:[{title:'Image',id:'Image'},{title:'List',id:'List'},{title:'Properties',id:'Properties'},{title:'Tasks',id:'Tasks'},{title:'Text_Area',id:'Text_Area'},{title:'Titled_Notes',id:'Titled_Notes'},],
  types : [],
  selectedType:null,
  secondaryModel:null,
  actions:{
    Submit: function(){
      var context = this;
      var qTags = [];
      for(var key in this.get('tags')){
        if(this.get('tags').hasOwnProperty(key)){
          qTags.push(this.get('tags')[key]);
        }
      }
      var embedded = this.get('secondaryModel.embedded');
      var parent = this.get('secondaryModel.parent')
      this.GetNewCard(this.get('secondaryModel.onMainDisplay'),parent,qTags).then(function(cardPackage){
        var card = cardPackage.card;
        var tags = cardPackage.tags;
        var position = cardPackage.position;
        var title = context.get('title');
        card.set('title',title);
        card.set('template',context.get('selectedTemplate'));
        card.set('type',context.get('selectedType'));
        context.SetParent(card,parent,embedded).then(function(card){
          context.CleanUp();
        });
      });
    },
    tagAdded:function(item){
      this.tags[item] = item;
    },
    tagRemoved:function(item){
      delete this.tags[item];
    },
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
                    resolve(card);
                  });
                });
              });
            });
          });
        })
      }else{
        card.save();
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
    });
  });
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
  CleanUp:function(){
    this.set('title','');
    this.set('description','');
    this.set('tags',[]);
    this.send('close');
  }
});

;