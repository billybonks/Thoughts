'use strict';
App.PropertyMainComponent = App.BaseSectionComponent.extend({
  didInsertElement:function(){
    console.log(this.toString());
  },
  actions:{
    openModal:function(modalName,model){
      return this.sendAction('openModal',modalName,model);
    }
  },
  context:function(){
    return this
  }.property(),
});