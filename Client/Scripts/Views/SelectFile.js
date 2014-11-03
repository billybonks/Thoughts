App.SelectFile = Ember.View.extend({
  templateName:'selectFile',
  actions:{
    addUrl:function(){
      var url = this.get('content.url');
      var urlParts = url.split('/');
      var name = urlParts[urlParts.length-1];
      this.get('content.files').pushObject({name:name,url:this.get('content.url'),type:'url',size:'N/A'})
    }
  },
  valueChanged:function(){
    var files = $('#UploadFiles')[0].files;
    for(var i = 0;i<files.length;i++){
        this.loadFile(files[i],this.get('content.files'),this.get('content.store'))
    }
  }.observes('content.file'),
  loadFile:function(file,files){
    files.pushObject(file)
    /*
    var reader = new FileReader();
    reader.addEventListener('load',function(data){
      files.pushObject({name:file.name,type:file.type,data:data.target.result,size:file.size})
    });
    reader.readAsDataURL(file);
    */
  }
});
