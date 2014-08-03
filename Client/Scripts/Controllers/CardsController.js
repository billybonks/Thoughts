'use strict';
App.CardsIndexController = Ember.ArrayController.extend(App.NewCardMixin,{
  views:['Cards','Templates'],
  selectedView:'Cards',
  templates:false,
  cards:true,
  Notify:function(message,level){
    this.send('notification',message,level);
  },
  viewSwapper:function(){
    if(this.get('selectedView') === 'Templates'){
      this.set('templates',true);
      this.set('cards',false);
    }
    if(this.get('selectedView') === 'Cards'){
      this.set('templates',false);
      this.set('cards',true);
    }
  }.observes('selectedView'),
    display:function(model){
    if(this.get('templates')){
      if(this.get('model.isTemplate')){
        return true;
      }
    }else{
      if(this.get('model.isTemplate')){
        return false;
      }else{
        return true;
      }
    }
  }.property('parentController.templates'),
  cardFormPackage:function(){
      var cardPackage = {}
      cardPackage.parent = null;
      cardPackage.onMainDisplay = true;
      return cardPackage;
  }.property()
});
