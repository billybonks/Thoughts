App.SelectFile = Ember.View.extend({
  templateName:'selectFile',
  files:Ember.A(),
  actions:{
    addUrl:function(){
      this.get('files').pushObject({title:this.get('content.url'),url:this.get('content.url'),type:'url',size:'N/A'})
    }
  },
  valueChanged:function(){
    var files = $('#UploadFiles')[0].files;
    for(var i = 0;i<files.length;i++){
        this.loadFile(files[i])
    }
  }.observes('content.file'),
  loadFile:function(file){
    var context = this;
    var reader = new FileReader();
    reader.addEventListener('load',function(data){
      context.get('files').pushObject({title:file.name,type:file.type,url:data.target.result,size:file.size})
    });
    reader.readAsDataURL(file);
  }
});
