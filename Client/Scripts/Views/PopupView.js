//  $('element_to_pop_up').bPopup();

App.PopupView = Ember.View.extend({
  layoutName : 'popup',
  actions:{
    close:function(){console.log('close')}
  },
  didInsertElement: function (arg1, arg2) {

   $('#popup').bPopup();
  }
});