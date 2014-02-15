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

App.TableEntryComponent = Ember.Component.extend({
    isNediting:false,
    isVediting:false,
    actions:{
      toggleV:function(){this.get('isVediting')? this.set('isVediting', false): this.set('isVediting', true);},
      toggleN:function(){this.get('isNediting')? this.set('isNediting', false): this.set('isNediting', true);},
    }
})
//  {{table-entry data=item.data}}
App.DraggableElement = Ember.View.extend({
    layoutName:'draggableElement',

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