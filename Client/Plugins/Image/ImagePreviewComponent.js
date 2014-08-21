'use strict'
App.ImagePreviewComponent = Ember.Component.extend(DragNDrop.DragAndDroppable,App.PopupMixin,{
  classNames: ['image-view'],
  actions:{
    viewFullImage:function(){
      var data = {image:this.get('item.data.image')};
      var view = Ember.View.extend({
        templateName:'imagePopup',
      });
      return this.OpenModal(null,null,data,view,'Image');
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
