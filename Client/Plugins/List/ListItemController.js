'use strict';
App.ListItemController = Ember.Controller.extend(App.SubmitAttachmentMixin,{
  isEditing:false,
  actions: {
    Edit:function(){
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
      console.log('edit')
      },
    Update:function(){
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
      this.SaveAttachment(this.get('model'));
    }
    }
})
