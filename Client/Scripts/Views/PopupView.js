'use strict';
App.PopupView = Ember.View.extend({
  layoutName : 'popup',
  actions:{
    close:function(){
      var event = 'event'
      Em.instrument('mouse.move',event,function(){},this)
      console.log('close')
    }
  },
  didInsertElement: function (arg1, arg2) {
    var close = onClose(this.get('context'))
    $('#popup').bPopup({
      closeClass:'close',
     // onClose: close
    });
    Ember.subscribe('popup.close', {
      after: function(name, timestamp, payload) {
        close();
      }
    });
  }
});

function onClose(context){
  function togglePopup(){
      Ember.instrument(context.toString(), {}, function() {
      });
  }
  return togglePopup;
}