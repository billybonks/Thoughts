'use strict';
App.DocumentsMainComponent = App.BaseSectionComponent.extend(DragNDrop.DragAndDroppable,{
  drop: function(event) {
    var files = event.originalEvent.dataTransfer.files;
    for(var i = 0;i<files.length;i++){
      var item = this.get('data').find(function(item, index, enumerable){
        if(item.get('data.title') == files[i].name)
          return item;
      })
      this.UploadDocument(files[i],item);
    }
    event.preventDefault();
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
