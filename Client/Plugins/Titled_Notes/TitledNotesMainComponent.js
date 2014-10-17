'use strict';
App.TitledNotesMainComponent = App.BaseSectionComponent.extend({
  actions:{
    CreateTitledNote:function(){
      var data={
        question:this.get('newTitledNote')
      }
      this.submitAttachment(data);
      this.set('newTitledNote','')
    },
    ToggleEdit:function(){
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
    }
  }
});
