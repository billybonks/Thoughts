'use strict';
App.PhotoDropView = Ember.View.extend({
  templateName:'photoDrop',
  drop: function(event) {
    console.log('Dropped')
    this.controller.get('newPhoto').call(this.controller,event.originalEvent.dataTransfer.files);
    event.preventDefault();
    return false;
  },
  dragEnter: DragNDrop.cancel,
  dragOver: DragNDrop.cancel,
  draggable: 'true',
  dragStart: DragNDrop.cancel,
});

