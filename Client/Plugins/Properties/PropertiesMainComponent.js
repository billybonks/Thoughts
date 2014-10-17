'use strict';
App.PropertiesMainComponent = App.BaseSectionComponent.extend({
  types:['string','number'],
  didInsertElement:function(){
    console.log(this.toString());
  },
  actions:{
    openModal:function(){
      var data = {model:{name:null,value:null,type:null},types:this.get('types')};
      var view = Ember.View.extend({
        templateName:'propertyForm',
      });
      return this.OpenModal( this.get('CreateProperty'),null,data,view,'New Property');
    },
  },
  CreateProperty:function(data){
    this.submitAttachment(data.model);
  },
  context:function(){
    return this
  }.property(),
});