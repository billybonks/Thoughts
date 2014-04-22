'use strict';
App.PropertyController = Ember.ObjectController.extend(App.SubmitAttachmentMixin,{
    isEditing:false,
    actions:{
      toggleEdit:function(){this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);},
      Update:function(){
        this.SaveAttachment(this.get('model'));
        this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
      }
    },
  close:function(){
    console.log('closing')
  }
});