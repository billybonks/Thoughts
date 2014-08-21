'use strict'
App.ImagePreviewComponent = Ember.Component.extend(DragNDrop.DragAndDroppable, {
  classNames: ['image-view'],
  actions:{
    viewFullImage:function(){
      console.log('opening popper')
    }
  },
  dragStart: function(event) {
    console.log('dragStart');
    var model = this.get('item')
    var dataTransfer = event.originalEvent.dataTransfer;
    dataTransfer.setData('Type', 'Attachment');
    dataTransfer.setData('AttachmentType', 'Image');
    dataTransfer.setData('id', model.get('id'));
  }
})
