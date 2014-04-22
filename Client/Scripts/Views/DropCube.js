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
      var context = this
      this.store.find('attachment',event.originalEvent.dataTransfer.getData('id')).then(function(obj){
        obj.deleteRecord();
        obj.save().then(function(obj)
                        {
                          context.get('controller').FowardNotification('Attachment deleted','success')
                        });
      })

    }
    event.preventDefault();
    return false;
  }
});