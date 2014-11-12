DragNDrop = Ember.Namespace.create();

DragNDrop.cancel = function(event) {
  console.log('cancel')
  event.preventDefault();
  return false;
};
DragNDrop.blank = function(){
  return true;
};

DragNDrop.DragAndDroppable = Ember.Mixin.create({
  layoutName:'DragAndDroppable',
  attributeBindings: 'draggable',
  dragEnter: DragNDrop.cancel,
  dragOver: DragNDrop.cancel,
  draggable: 'true',
  dragStart: DragNDrop.cancel,
  drop:DragNDrop.cancel
});


DragNDrop.DropTarget = Ember.Mixin.create({
  dragEnter: DragNDrop.blank,
  dragOver: DragNDrop.blank,
  dragStart: DragNDrop.blank,
  drop:DragNDrop.blank
});
