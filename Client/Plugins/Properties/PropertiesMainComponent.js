'use strict';
App.PropertiesMainComponent = App.BaseSectionComponent.extend(App.PluginPopupOpenerMixin,{
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