'use strict';
App.PropertyView = Ember.View.extend(DragNDrop.DragAndDroppable,{
  templateName:'property',
  dragStart: function(event) {
    console.log('dragStart');
    var model = this.get('model')
    var dataTransfer = event.originalEvent.dataTransfer;
    dataTransfer.setData('Type', 'Attachment');
    dataTransfer.setData('AttachmentType', 'Property');
    dataTransfer.setData('id', model.get('id'));
  }
});