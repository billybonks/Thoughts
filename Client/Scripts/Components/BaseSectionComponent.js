'use strict';
App.BaseSectionComponent = Ember.Component.extend(App.SubmitAttachmentMixin,{
  section:null,
  isEditing:false,
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
  Notify:function(message,level){
    this.send('notification',message,level);
    this.get('targetObject').FowardNotification(message,level)
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
