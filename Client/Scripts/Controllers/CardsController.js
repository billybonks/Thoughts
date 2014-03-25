'use strict';
App.CardsIndexController = Ember.ArrayController.extend(App.PopupOpenerMixin,{
  views:['Cards','Templates'],
  selectedView:'Cards',
  templates:false,
  cards:true,
  viewSwapper:function(){
    if(this.get('selectedView') === 'Templates'){
      this.set('templates',true);
      this.set('cards',false);
    }
    if(this.get('selectedView') === 'Cards'){
      this.set('templates',false);
      this.set('cards',true);
    }
  }.observes('selectedView')
});