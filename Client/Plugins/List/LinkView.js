'use strict';
App.LinkView = Ember.View.extend(DragNDrop.DragAndDroppable,{
  dragStart: function(event) {
    console.log('dragStart');
    var model = this.get('model')
    var dataTransfer = event.originalEvent.dataTransfer;
    dataTransfer.setData('Type', 'Attachment');
    dataTransfer.setData('AttachmentType', 'link');
    dataTransfer.setData('id', model.get('id'));
  }
});
