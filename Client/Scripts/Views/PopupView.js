//  $('element_to_pop_up').bPopup();

App.PopupView = Ember.View.extend({
  layoutName : 'popup',
  didInsertElement: function (arg1, arg2) {

   $('#popup').bPopup();
  }
});