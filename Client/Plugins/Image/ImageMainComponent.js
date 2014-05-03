'use strict';
App.ImageMainComponent = App.BaseSectionComponent.extend({
  actions:{
    SelectImage:function(){
      var data = {model:{name:null,value:null,type:null},types:this.get('types')};
      var view = Ember.View.extend({
        templateName:'uploadFile',
      });
      return this.OpenModal( this.get('FilesSelected'),null,data,view,'Upload Image');
    },
  },
  FilesSelected:function(data){
    var reader = new FileReader();
    var images = [];
    var context = this;
    var files = data.files;
    for(var i = 0;i<files.length;i++){
      if(files[i].type.indexOf('image') >-1){
        reader.addEventListener('load',function(data){
          context.submitAttachment({
            image:data.target.result,
            type:'Image'
          });
        });
        reader.readAsDataURL(files[i]);
      }else{
        console.log('no img found');
      }
    }
  }
});
