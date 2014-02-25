'use strict';
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