'use strict';
App.CardFormController = Ember.ObjectController.extend(App.PopupMixin,App.OnErrorMixin,{
  title:null,
  description:null,
  store: null,
  tags:{},
  actions:{
    Submit: function(){
      //   var tags = this.get('tagger').getTags();
      var card = this.store.createRecord('card', {
        title: this.get('title'),
        description: this.get('description'),
        left:0,
        top:0,
        tagsIn : [],//tags
        onMainDisplay:true,
        template:this.get('selectedTemplate')
      });
      var tags = this.get('tags');
      var context = this;
      card.get('tags').then(function(result){
        for(var tag in tags){
          var t = context.store.createRecord('tag',{
            id:tags[tag],
            title:tags[tag]
          });
          result.pushObject(t);
        }
        var errorHandler = context.OnError(context,card);
        card.save().catch(errorHandler);
      });
      this.set('title','');
      this.set('description','');
      this.send('close');
    },
    tagAdded:function(item){
      this.tags[item] = item;
      console.log(this.tags);
    },
    tagRemoved:function(item){
      delete this.tags[item];
      console.log(this.tags);
    },
  },
});