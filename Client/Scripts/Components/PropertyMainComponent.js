App.PropertyMainComponent = App.BaseSectionComponent.extend({
  actions:{
    ToggleEdit:function(){
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
    }
  },
});

App.PropertyFormComponent = App.BaseSectionComponent.extend({
  types:['string','number'],
  actions:{
      CreateProperty:function(){
      var data = {
        name:this.get('name'),
        value:this.get('value'),
        type:this.get('selectedType')
      }
      this.submitAttachment(data);
      this.set('name','');
      this.set('value','');
    }
  }
});

App.PropertyController = Ember.ObjectController.extend({
    isNediting:false,
    isVediting:false,
    actions:{
      toggleV:function(){this.get('isVediting')? this.set('isVediting', false): this.set('isVediting', true);},
      toggleN:function(){this.get('isNediting')? this.set('isNediting', false): this.set('isNediting', true);},
    }
});



App.PropertyView = Ember.View.extend(DragNDrop.DragAndDroppable,{
  templateName:'property',
  dragStart: function(event) {
    console.log('dragStart');
    var model = this.get('model')
    var dataTransfer = event.originalEvent.dataTransfer;
    dataTransfer.setData('Type', 'Attachment');
    dataTransfer.setData('AttachmentType', 'Property');
    dataTransfer.setData('id', model.get('id'));
  }
});
App.TableEntryComponent = Ember.Component.extend({

})
//  {{table-entry data=item.data}}
App.DraggableElement = Ember.View.extend({


    dragLeave:function(e){console.log('startDrag')},
    drop:function(e){console.log('drop')}
})

App.EditBox = Ember.TextField.extend({
  keyDown:function(e){
    if(e.keyCode == 13){
      this.get('toggleDone')? this.set('toggleDone', false): this.set('toggleDone', true);
    }
  }
});