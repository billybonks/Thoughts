'use strict';
App.CardFormController = Ember.ObjectController.extend(App.PopupMixin,{
  title:null,
  description:null,
  store: null,
  options:['QQ','ll'],
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
      card.save();
      this.set('title','');
      this.set('description','');
      this.send('close');
    }
  },
});