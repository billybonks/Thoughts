'use strict';
App.DocumentsMainComponent = App.BaseSectionComponent.extend({
  actions:{
    SelectFile:function(){
      var data = {model:{name:null,value:null,type:null},types:this.get('types')};
      var view = Ember.View.extend({
        templateName:'uploadFile',
      });
      return this.OpenModal( this.get('FilesSelected'),null,data,view,'Upload Document');
    },
  },
  FilesSelected:function(data){
    var files = data.files;
    for(var i = 0;i<files.length;i++){
      var item = this.get('data').find(function(item, index, enumerable){
        if(item.get('data.title') == files[i].name)
          return item;
      })
      this.UploadDocument(files[i],item);
    }
  },
  drop: function(event) {
nt.preventDefault();
    return false;
  },
  UpdateDocument:function(file,item){
  },
  UploadDocument:function(file,item){
    var reader = new FileReader();
    reader.addEventListener('load',this.OnReader(file,item));
    reader.readAsDataURL(file);
  },
  OnReader:function(file,item){
    var name = file.name;
    var type = file.type;
    var context = this;
    var item = item;
    return function(data){
      if(item){
        item.get('data').data = data.target.result;
        item.set('type','Documents');
        context.SaveAttachment(item)
      }else{
        context.submitAttachment({
          title:name,
          data:data.target.result,
          type:type
        });
      }
    }
  },
  draggable: 'false',
});
