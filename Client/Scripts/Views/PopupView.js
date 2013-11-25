//  $('element_to_pop_up').bPopup();

App.PopupView = Ember.View.extend({
  layoutName : 'popup',
  actions:{
    close:function(){
      Em.instrument("mouse.move",event,function(){},this)
      console.log('close')
    }
  },
  didInsertElement: function (arg1, arg2) {
    var controller = this.get('controller')

    $('#popup').bPopup({
      closeClass:'close',
      onClose: onClose(controller)
    });
  }
});

function onClose(controller){
  function togglePopup(){
    console.log('closing '+controller.get('word'))
    controller.close()
  }

  return togglePopup;
}