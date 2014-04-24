'use strict';
App.DocumentsDropView = Ember.View.extend({
  templateName:'documentDrop',
  drop: function(event) {
    console.log('Dropped')
  },
  dragEnter: DragNDrop.cancel,
  dragOver: DragNDrop.cancel,
  draggable: 'true',
  dragStart: DragNDrop.cancel,
});
