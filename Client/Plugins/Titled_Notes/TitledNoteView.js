'use strict';
App.TitledNoteView = Ember.View.extend(DragNDrop.DragAndDroppable,{
  dragStart: function(event) {
    console.log('dragStart');
    var model = this.get('model')
    var dataTransfer = event.originalEvent.dataTransfer;
    dataTransfer.setData('Type', 'Attachment');
    dataTransfer.setData('AttachmentType', 'TitledNote');
    dataTransfer.setData('id', model.get('id'));
  }
});
