'use strict';
App.ImageMainComponent = App.BaseSectionComponent.extend({
  actions:{
    hello:function(){
      console.log('hi')
    },
    SelectFile:function(){
      return this.OpenModal( this.get('FilesSelected'),null,{},App.SelectFile,'Upload File');
    }
  },
  FilesSelected:function(files){
  }
});
