'use strict'
App.PropertyListitemComponent = Ember.Component.extend(App.SubmitAttachmentMixin, DragNDrop.DragAndDroppable, {
  isEditing: false,
  actions: {
    toggleEdit: function() {
      this.get('isEditing') ? this.set('isEditing', false) : this.set('isEditing', true);
    },
    Update: function() {
      this.SaveAttachment(this.get('model'));
      this.get('isEditing') ? this.set('isEditing', false) : this.set('isEditing', true);
    }
  },
  dragStart: function(event) {
    console.log('dragStart');
    var model = this.get('model')
    var dataTransfer = event.originalEvent.dataTransfer;
    dataTransfer.setData('Type', 'Attachment');
    dataTransfer.setData('AttachmentType', 'Property');
    dataTransfer.setData('id', model.get('id'));
  }
})
