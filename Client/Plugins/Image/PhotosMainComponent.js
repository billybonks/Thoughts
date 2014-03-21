'use strict';
App.PhotosMainComponent = App.BaseSectionComponent.extend({
  actions:{

  },
  newPhoto:function(files){
    var reader = new FileReader();
    var images = [];
    var context = this;
    for(var i = 0;i<files.length;i++){
      if(files[i].type.indexOf('image') >-1){
        reader.addEventListener('load',function(data){
          context.submitAttachment({
            image:data.target.result
          });

          console.log(data.target.result.split(','));
          photoBin = reader.result;
          console.log(reader);
          console.log(reader.result)
        });
        reader.readAsDataURL(files[i]);
      }else{
        console.log('no img found');
      }
    }
  }
});