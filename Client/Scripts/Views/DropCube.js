'use strict';
App.DropCube = Ember.View.extend({
  templateName:'Qube',
  click:function(e){
    console.log('clicked')
  },
  dragEnter: DragNDrop.cancel,
  dragOver: DragNDrop.cancel,
  drop: function(event) {
    if(event.originalEvent.dataTransfer.getData('Type') === 'Attachment'){
     this.store.find('attachment',event.originalEvent.dataTransfer.getData('id')).then(function(obj){
        obj.deleteRecord();
        obj.save();
      })

    }
    event.preventDefault();
    return false;
  }
});