App.UploadModalComponent =Ember.Widgets.ModalComponent.extend({
  actions:{
      sendConfirm:function(){
        if(this.get('isDone')){
            this.get('resolve')(this.get('content.ret'))
            this.hide();
        }else{
            if(!this.get('isUploading')){
              this.set('confirmText','Uploading...')
              this.set('isUploading',true);
              this.set('uploadStatus',Ember.A());
              var context = this;

              this.get('content.files').forEach(function(file){
                context.get('uploadStatus').pushObject(Ember.Object.create({name:file.name,status:'queued'}));
              })
              var ret = [];
              this.set('content.ret',ret);
              var length = this.get('content.files.length');
              var counter = 0;
              this.get('content.files').forEach(function(file){
                var status = context.get('uploadStatus').findBy('name',file.name);
                status.set('status','uploading')
                context.proccessFile(file).then(function(url){
                  counter++;
                  var status = context.get('uploadStatus').findBy('name',file.name);
                  status.set('status','done')
                  ret.push({file:file,url:url});
                  if(counter == length){
                    context.set('isDone',true)
                    context.set('confirmText','Done')
                  }
                },function(error){
                  var status = context.get('uploadStatus').findBy('name',file.name);
                  status.set('status','error')
                  if(counter == length){
                    context.set('isDone',true)
                    context.set('confirmText','Done')
                  }
                });
            })
          }
        }
    },
      removeFile:function(file){
        this.get('content.files').removeObject(file);
      }
  },
  proccessFile:function(file){
    var context = this;
    return new Promise(function(resolve, reject) {
      if(file.url){
        resolve(file.url)
      }else{
        context.getUrl(file.name).then(function(url){
          context.uploadDirect(file).then(function(file){
            resolve(url)
          },function(error){
            reject(error)
          });
        });
      }
    });
  },
  getUrl:function(name){
    var context =this;
    return new Promise(function(resolve, reject) {
      var bucket = 'thoughts-billybonks';
      var region = 'eu-west-1'
      var applications = context.get('content.store').all('application');
      var application = applications.objectAt(0);
      var id = application.get('userId');
      resolve('https://'+bucket+'.s3-'+region+'.amazonaws.com/'+id+'/'+name);
  /*    $.ajax({
        type: "GET",
        url: window.AppSettings.WebserviceURL + '/awsurl?key='+name,
        headers: {
          Authorization: window.AppSettings.token
        },
        success: function(data, status, jqXHR) {
          resolve(data);
        },
        error: function(jqXHR, satus, error) {
          reject(error);
        }
      });*/
    });
  },
  uploadFile:function(url,file){
    return new Promise(function(resolve, reject) {
      $.ajax({
        type: "PUT",
        url: url,
        data:file.data,
        headers: {
          //Content-Type: window.AppSettings.token
        },
        success: function(data, status, jqXHR) {
          resolve(file);
        },
        error: function(jqXHR, satus, error) {
          reject(error);
        }
      });
    });
  },
  uploadDirect:function(file){
    var context = this;
    return new Promise(function(resolve, reject) {
      AWS.config.credentials = new AWS.Credentials(window.AppSettings.awsCreds);
      AWS.config.region = 'eu-west-1';
      var applications = context.get('content.store').all('application');
      var application = applications.objectAt(0);
      var id = application.get('userId');
      var status = {name:file.name,status:'Queued',file:file}
      context.get('uploadStatus').push(status)
      var bucket = new AWS.S3({params: {Bucket: 'thoughts-billybonks'}});
      var params = {Key: id+'/'+file.name, ContentType: file.type, Body: file};
      bucket.putObject(params, function (err, data) {
        if(err) reject(err); else resolve(file);
      });
    });
  }
})

App.UploadModalComponent.reopenClass({
  open:function(options){
    /*options = {
      content: {files:Ember.A()},
      contentViewClass:App.SelectFile,
      headerText:'Upload File',
      confirmText:'Upload'
    }*/
    var context = this;
    return new Promise(function(resolve,reject){
      options.resolve = resolve;
      options.reject = reject;
      context.popup(options);
    })

  }
})
