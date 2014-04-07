'use strict';
App.PropertiesMainComponent = App.BaseSectionComponent.extend({
  didInsertElement:function(){
    console.log(this.toString());
  },
  actions:{
    openModal:function(modalName,model,secondaryModel){
      return this.get('targetObject').openModal(modalName,model,secondaryModel);
    }
  },
  context:function(){
    return this
  }.property(),
});