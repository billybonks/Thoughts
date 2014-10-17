'use strict';
App.BaseSectionComponent = Ember.Component.extend(App.SubmitAttachmentMixin,App.PopupMixin,{
  section:null,
  isEditing:false,
  Notify:function(message,level){
    this.send('notification',message,level);
    this.get('targetObject').FowardNotification(message,level)
  }
});
