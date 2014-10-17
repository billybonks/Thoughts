'use strict';
App.DocumentsDropView = Ember.View.extend({
  templateName:'documentDrop',
  drop: function(event) {
    this.set(this.get('contentBinding._to'),event.originalEvent.dataTransfer.files);
    event.preventDefault();
  },
  dragEnter: DragNDrop.cancel,
  dragOver: DragNDrop.cancel,
  draggable: 'false',
  dragStart: DragNDrop.cancel,
});
