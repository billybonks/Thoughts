'use strict';
App.ImageMainComponent = App.BaseSectionComponent.extend({
  actions:{
    SelectFile:function(){
      var context = this;
      App.UploadModalComponent.open({
        targetObject: this,
        content: {store:this.get('store'),files:Ember.A()},
        contentViewClass:App.SelectFile,
        headerText:'Upload File',
        confirmText:'Upload'
      }).then(function(files){
          files.forEach(function(file){
            var data ={ name : file.file.name,url:file.url  }
            context.submitAttachment(data);
          })
      },function(error){

      })
    //  Bootstrap.ModalManager.open('selectFile', 'Select Files', App.SelectFile , this.get('manualButtons'), this);
    //  return this.OpenModal( this.get('FilesSelected'),null,{store:this.get('store')},App.SelectFile,'Upload File');
    }
  },
  FilesSelected:function(files){
  }
});
