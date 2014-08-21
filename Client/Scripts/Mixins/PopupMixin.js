App.PopupMixin = Ember.Mixin.create({
  modal:null,
  cancel:null,
  confirm:null,
  actions:{
    BaseModalConfirm:function(){
      if(this.get('confirm')){
        this.get('confirm').call(this,this.get('modal.content'));
      }
    },
    BaseModalCancel:function(){
      if(this.get('cancel')){
        this.get('cancel').call(this,this.get('modal.content'));
      }
    },
  },
  OpenModal:function(confirm,cancel,content,contentViewClass,headerText){
    this.set('confirm',confirm);
    this.set('cancel',cancel);
    this.set('modal',Ember.Widgets.ModalComponent.popup({
      targetObject: this,
      confirm: "BaseModalConfirm",
      cancel: "BaseModalCancel",
      content: content,
      contentViewClass:contentViewClass,
      headerText:headerText
    }));
    return this.get('modal');
  }
});
