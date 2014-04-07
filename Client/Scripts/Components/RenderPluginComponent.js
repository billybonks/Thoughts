'use strict';
App.RenderPluginComponent = Ember.Component.extend({
  isImage:Ember.computed.equal('model.type', 'Image'),
  isList:Ember.computed.equal('model.type', 'List'),
  isProperties:Ember.computed.equal('model.type', 'Properties'),
  isTasks:Ember.computed.equal('model.type', 'Tasks'),
  isText_Area:Ember.computed.equal('model.type', 'Text_Area'),
  isTitled_Notes:Ember.computed.equal('model.type', 'Titled_Notes'),
  configuration:function(){
     var parentId = parseInt(this.get('parent.id'));
     var configs = this.get('model.configurations');
     return configs.find(function(item, index, enumerable){
       var f = item.get('for')
       if(f === parentId){
         return true;
       }
     },configs)
  }.property('model.configurations.@each.for'),
  actions:{
  },
  openModal:function(modalName,model,secondaryModel){
    return this.get('targetObject').openPluginModal(modalName,model,secondaryModel);
  },
  isEmbedded:function(){
    var configuration = this.get('configuration')
    if(configuration){
      console.log(configuration)
      return configuration.get('embedded');
    }else{
      return false;
    }
  }.property('configuration')
});

/*

*/