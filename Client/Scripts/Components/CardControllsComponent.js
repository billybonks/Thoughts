'use strict';
App.CardControllsComponent = Ember.Component.extend({
  edit:false,
  share:false,
  section:false,

  actions:{
    onDelete:function(){
    },
    onShare:function(){
    },
    onEdit:function(){
    },
    onAddSection:function(){
      this.get('section') ? this.set('section',false):this.set('section',true);
    },
  }
});