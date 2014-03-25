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
        context.store.find('section',24743).then(function(section){
          section.get('attachments').forEach(function(attq){
            console.log(attq);
          })
        })
        obj.deleteRecord();
        obj.save();
      })

    }
    event.preventDefault();
    return false;
  }
});