'use strict';
App.CardFormController = Ember.ObjectController.extend(App.PopupMixin,App.OnErrorMixin,{
  title:null,
  description:null,
  store: null,
  tags:{},
  selectedTemplate:-1,
  types:['Image','List','Properties','Tasks','Text_Area','Titled_Notes',],
  selectedType:null,
  secondaryModel:null,
  actions:{
    Submit: function(){
      var qTags=[];
      var context = this;
      for(var key in this.get('tags')){
        qTags.push(this.get('tags')[key])
      }
      var parent = this.get('secondaryModel').model;
      var embedded;
      if(!this.get('secondaryModel').isMain){
        embedded = true;
      }else{
        embedded = false;
      }
      this.store.find('card',parent.get('id')).then(function(parent){
        context.store.find('tag',{names:qTags}).then(function(result){
          var card = context.store.createRecord('card', {
            title: context.get('title'),
            description: context.get('description'),
            left:0,
            top:0,
            tagsIn : [],//tags
            onMainDisplay:true,
            template:context.get('selectedTemplate'),
            type : context.get('selectedType'),
          });
          var errorHandler = context.OnError(context,card);
          card.get('tags').then(function(cTags){
            cTags.pushObjects(result);
            card.get('parents').then(function(parents){
            if(parent != null){
              parents.pushObject(parent);
              card.set('onMainDisplay',false);
              parent.get('children').then(function(children){
                card.save().then(function(card){
                  var configuration = context.store.createRecord('configuration',{
                    position: children.get('length')+1,
                    embedded: embedded,
                    'for':parent.get('id'),
                    configures:card
                  })
                  configuration.save().then(function(configuration){
                    card.get('configurations').then(function(configurations){
                      configurations.pushObject(configuration);
                    })
                    children.pushObject(card);
                    context.cleanUp.call(context);
                  })
                })
                .catch(errorHandler);
              })
            }else{
              card.save().catch(errorHandler);
              context.cleanUp.call(context);
            }
           })
          });
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
  cleanUp:function(){
    this.set('title','');
    this.set('description','');
    this.set('tags',[]);
    this.send('close');
  }
});