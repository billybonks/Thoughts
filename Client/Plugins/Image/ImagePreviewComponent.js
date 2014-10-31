'use strict'
App.ImagePreviewComponent = Ember.Component.extend(DragNDrop.DragAndDroppable,App.PopupMixin,{
  classNames: ['image-view'],
  actions:{
    viewFullImage:function(){
      var view = Ember.View.extend({
        templateName:'imagePopup',
      });
      return App.ImageModalComponent.popup({
        targetObject: this,
        content: this.get('item'),
        contentViewClass:view,
        headerText:this.get('item.data.name')
      })
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
