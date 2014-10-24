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
      //FIXME problem related to attachmetn not having card for some reason
      this.store.find('attachment',event.originalEvent.dataTransfer.getData('id')).then(function(obj){
        obj.deleteRecord();
        obj.get('card')
        var card = obj._data.card;
        obj.save().then(function(obj)
                        {
                          if(card){
                              card.get('attachments').then(function(attachments){
                                attachments.removeObject(obj);
                              })
                          }
                          Bootstrap.NM.push('Successfully deleted attachment', 'success');
                        },function(error){
                          Bootstrap.NM.push('Error deleting attachment', 'danger');
                        });
      })

    }
    event.preventDefault();
    return false;
  }
});
