'use strict';
App.DocumentsMainComponent = App.BaseSectionComponent.extend(DragNDrop.DragAndDroppable,{
  drop: function(event) {
    console.log('Dropped')
    this.UploadDocument(event.originalEvent.dataTransfer.files);
    event.preventDefault();
    return false;
  },
  UploadDocument:function(files){
    for(var i = 0;i<files.length;i++){
      var reader = new FileReader();
      reader.addEventListener('load',this.OnReader(files[i]));
      reader.readAsDataURL(files[i]);
    }
  },
  OnReader:function(file){
    var name = file.name;
    var type = file.type;
    var context = this;
    return function(data){
      context.submitAttachment({
        title:name,
        data:data.target.result,
        type:type
      });

    }
  },
  draggable: 'false',
});
