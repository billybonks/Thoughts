'use strict';
App.ListItemComponent = Ember.Component.extend(App.SubmitAttachmentMixin,DragNDrop.DragAndDroppable, {
  isEditing: false,
  actions: {
    Edit: function() {
      this.get('isEditing') ? this.set('isEditing', false) : this.set('isEditing', true);
      console.log('edit')
    },
    Update: function() {
      this.get('isEditing') ? this.set('isEditing', false) : this.set('isEditing', true);
      this.SaveAttachment(this.get('model'));
    }
  },
  dragStart: function(event) {
    console.log('dragStart');
    var model = this.get('model')
    var dataTransfer = event.originalEvent.dataTransfer;
    dataTransfer.setData('Type', 'Attachment');
    dataTransfer.setData('AttachmentType', 'link');
    dataTransfer.setData('id', model.get('id'));
  }
})
