'use strict';
App.DocumentsDropView = Ember.View.extend({
  templateName:'documentDrop',
  actions:{
    removeFile:function(file){
      this.get('content.files').removeObject(file);
    }
  },
  drop: function(event) {
    var droppedFiles = event.originalEvent.dataTransfer.files;
    for(var i = 0; i<droppedFiles.length;i++){
      this.get('callback')(droppedFiles[i],this.get('files'),this.get('store'))
    }
    event.preventDefault();
  },
  dragEnter: DragNDrop.cancel,
  dragOver: DragNDrop.cancel,
  draggable: 'false',
  dragStart: DragNDrop.cancel,
});
