'use strict';
App.PropertyMainComponent = App.BaseSectionComponent.extend({
  actions:{
    ToggleEdit:function(){
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
    }
  },
});