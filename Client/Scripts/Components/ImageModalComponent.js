App.ImageModalComponent =Ember.Widgets.ModalComponent.extend({
  didInsertElement:function(){
    this._super();
    $('.modal-dialog').innerWidth($('#image').width()+60);
  }
})
