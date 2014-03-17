'use strict';
App.ImageView = Ember.View.extend(DragNDrop.DragAndDroppable,{
  templateName:'image',
  classNames: ['image-view'],
  dragStart: function(event) {
    console.log('dragStart');
    var model = this.get('item')
    var dataTransfer = event.originalEvent.dataTransfer;
    dataTransfer.setData('Type', 'Attachment');
    dataTransfer.setData('AttachmentType', 'Image');
    dataTransfer.setData('id', model.get('id'));
  }
});