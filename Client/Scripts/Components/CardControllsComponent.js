'use strict';
App.CardControllsComponent = Ember.Component.extend(App.PopupMixin,{
  edit:false,
  share:false,
  section:false,

  actions:{
    onDelete:function(){
    },
    onShare:function(){
      this.get('section') ? this.set('section',false):this.set('section',true);
    },
    onEdit:function(){
      this.get('section') ? this.set('section',false):this.set('section',true);
    },
    onAddSection:function(){
      this.TogglePopup('section');
      //this.get('section') ? this.set('section',false):this.set('section',true);
    },
    openModal:function(modalName,model){
      return this.sendAction('openModal',modalName,model);
    }
  },
  didInsertElement:function(){
    this.SubscribePopup(this,'section');
  },

});