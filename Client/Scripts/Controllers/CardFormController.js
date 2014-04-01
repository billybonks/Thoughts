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
      var secondaryModel = this.get('secondaryModel')
      this.store.find('tag',{names:qTags}).then(function(result){
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

        card.get('tags').then(function(cTags){
          result.forEach(function(tag){
            console.log(tag.get('title'));
          })
          card.get('parents').then(function(parents){
          if(secondaryModel != null){
            parents.pushObject(secondaryModel);
            card.set('onMainDisplay',false);
          }
          cTags.pushObjects(result);
          var errorHandler = context.OnError(context,card);
          card.save().catch(errorHandler);
          context.set('title','');
          context.set('description','');
          context.set('tags',[]);
          context.send('close');
          })
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
});