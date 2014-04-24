
var Stream = require('stream');
var cheerio = require('cheerio')
var request = require('request')
var url = require('url');
var fs = require('fs');
var mkpath = require('./mkpath');
var uuid = require('node-uuid');
var googleDrive = require('google-drive');
var Google = require('./../controllers/Google')();
var mime = require('mime');
var controller = require('./../controllers/Controller.js');
var googleapis = require('googleapis');
//var AttachmentController = require('google-drive');
module.exports = function(){
  'use strict';
  var CardController = require('./../controllers/CardController')();
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function AttachmentProcessor(){

  }

  AttachmentProcessor.prototype = new controller();

  AttachmentProcessor.prototype.ProccessAttatchment=function(attachment,action,user){
    //console.log(attachment)
    console.log(attachment.type)
    var methodName = ('Process'+action+attachment.type);
    var returnStream = new Stream();
    console.log(methodName);
    if(this[methodName]){
      console.log('exists')
      this[methodName](attachment,user)
      .on('data',function(results){
        returnStream.emit('data',results);
      })
      .on('error',function(error){
      returnStream.emit('error',{'function':'ProcessAttachment'+methodName,type:'attachmentProccessError',innerException:error});
      })
    }else{
      setTimeout(function() {
        returnStream.emit('data',attachment.data);
      }, 100,returnStream);
    }
    return returnStream;
  }


  /* ========================================================================================================
   *
   * Generated Methods
   *
   * ===================================================================================================== */
  AttachmentProcessor.prototype.ProcessCreateList = function(attachment,user){

    var href = attachment.data.link;
    var responseStream = new Stream();
    if(typeof href  == 'undefined'){
      setTimeout(function() {
        responseStream.emit('data',attachment.data);
      }, 100,responseStream);
    }else{
      request(href, function(err, resp, html) {
        if (err){
          console.log(err);
          console.log('Emitting error');
          responseStream.emit('error',err.code);
        }
        var $ = cheerio.load(html);
        var data = {
          title:$('TITLE').text()?$('TITLE').text():'no title found',
          href : href
        }
        responseStream.emit('data',data);
      });
    }
    return responseStream;
  }


  AttachmentProcessor.prototype.ProcessCreateImage = function(attachment,user){
    var resultStream = new Stream();
    var regex = /^data:.+\/(.+);base64,(.*)$/;
    var matches = attachment.data.image.match(regex);
    var ext = matches[1];
    var data = matches[2];
    var buffer = new Buffer(data, 'base64');
    var name = uuid.v4()+'.'+ext;
    var path = '/data/users/'+user.id+'/images';
    mkpath.sync('./Client'+path);
    fs.writeFile('./Client'+path+'/'+name, buffer,function(err, written,buffer) {
      data = {
        image:path+'/'+name
      }
      resultStream.emit('data',data);
    });
    return resultStream;
  }

  AttachmentProcessor.prototype.ProcessCreateDocuments = function(attachment,user){
    var resultStream = new Stream();
    var context = this;
    Google.RefreshAccessToken(user.accounts.Google.refresh_token,user.id)
    .on('data',function(access_token){
      var buffer = context.FormatData(attachment);
      context.UploadNewDocument.call(context,buffer,attachment.data.type,attachment.data.title,attachment.card,user,access_token).on('data',function(data){
        resultStream.emit('data',data);
      })
    })
    return resultStream;
  }

  AttachmentProcessor.prototype.ProcessUpdateDocuments = function(attachment,user){
    var resultStream = new Stream();
    var context = this;
    Google.RefreshAccessToken(user.accounts.Google.refresh_token,user.id)
    .on('data',function(access_token){
      var buffer = context.FormatData(attachment);
      context.UpdateDocument.call(context,buffer,attachment.data.type,attachment.data.title,attachment.data.foreign_id,access_token).on('data',function(data){
        resultStream.emit('data',data);
      })
    });
    return resultStream;
  }

  AttachmentProcessor.prototype.FormatData = function(attachment){
      if(attachment.data.type === ""){
        var mimeType ='application/vnd.google-apps.document'//mime.lookup(attachment.data.title);
        attachment.data.data = attachment.data.data.replace('data:;','data:'+mimeType+';');
        attachment.data.type = mimeType
      }
      var regex = /^data:.+\/(.+);base64,(.*)$/;
      var matches = attachment.data.data.match(regex);
      var ext = matches[1];
      var data = matches[2];
      return new Buffer(data, 'base64');
  }

  AttachmentProcessor.prototype.UploadNewDocument =  function(buffer,mimeType,title,cardId,user,access_token){
    var context = this;
    var resultStream = new Stream();
    this.FindRoot(access_token).on('data',function(rootId){
      context.FindAttachmentFolder(access_token,cardId,rootId).on('data',function(parentFolder){
        var auth = new googleapis.OAuth2Client();
        var returnStream = new Stream();
        auth.setCredentials({
          access_token:access_token
        });
        googleapis.discover('drive', 'v2').execute(function(err, client) {
          client
          .drive.files.insert({ title: title, mimeType: mimeType,parents:[parentFolder] })
          .withMedia('application/base64', buffer)
          .withAuthClient(auth)
          .execute(function(err, result) {
            var data = {
              link:result.webContentLink,
              foreign_id:result.id,
              title:result.title,
              downloadUrl:result.downloadUrl,
              iconLink:result.iconLink
            }
            resultStream.emit('data',data);
          });
        })
      })
    }).on('error', function(error){
    })
    return resultStream;
  }

 AttachmentProcessor.prototype.UpdateDocument = function(buffer,mimeType,title,fileId,access_token){
   var auth = new googleapis.OAuth2Client();
   var returnStream = new Stream();
   auth.setCredentials({
     access_token:access_token
   });
   googleapis.discover('drive', 'v2').execute(function(err, client) {
     client
     .drive.files.update({ fileId: fileId}, { title: title, mimeType: mimeType })
     .withMedia('application/base64',buffer)
     .withAuthClient(auth)
     .execute(function(err, result) {

       if(result){
         var data = {
           link:result.webContentLink,
           foreign_id:result.id,
           title:result.title,
           downloadUrl:result.downloadUrl,
           iconLink:result.iconLink
         }
         returnStream.emit('data',data);
       }else{
         console.log(err)
         returnStream.emit('error',err);
       }
     });
   })
   return returnStream;
 }

 AttachmentProcessor.prototype.GetDocumentAttachment = function(cardId,title){
   var query = ['Start card=node('+cardId+')',
                'Match attachment-[:Attached]->card',
                'where attachment.title = {title}',
                'return attachment'];
   var variableHash = {title:title};
   return this.executeQuery(query.join('\n'),variableHash);

 }

  AttachmentProcessor.prototype.FindRoot = function(accessToken){
    var context = this;
    var returnStream = new Stream();
    googleDrive(accessToken).files().list({q:"'root' in parents and title='Cards' and mimeType = 'application/vnd.google-apps.folder'"},
                                          function(err, response, body) {
                                            body = JSON.parse(body);
                                            if (err){
                                              console.log('error')
                                            }
                                            if(!body.error){
                                              if(body.items.length == 0){
                                                var folder = {
                                                  "title": "Cards",
                                                  "mimeType": "application/vnd.google-apps.folder"
                                                }
                                                googleDrive(accessToken).files().insert(folder, {},  function(err, response, body) {
                                                  body = JSON.parse(body);
                                                  returnStream.emit('data', body.id);
                                                });
                                              }else{
                                                returnStream.emit('data', body.items[0].id);
                                              }
                                            }else{
                                              returnStream.emit('error', {});
                                            }
                                          });
    return returnStream;
  }

  AttachmentProcessor.prototype.FindAttachmentFolder = function(accessToken,cardId,rootId){
    var responseStream = new Stream();
    var url = "https://www.googleapis.com/drive/v2/files/0B7cV1rUiPOCJcjc4NVc5bEJsMkk/children?";
    var query = "q=title%3D'"+cardId+"'+and+mimeType+%3D+'application%2Fvnd.google-apps.folder'";
    var authValue = 'Bearer '+accessToken;
    url = url + query
    var options = {
      url: url,
      headers: {
        Authorization:authValue
      }
    }
    request(options,function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var body = JSON.parse(body);
        if(body.items.length === 0){
          var folder = {
            "title": cardId,
            "mimeType": "application/vnd.google-apps.folder",
            "parents": [{
              "id": rootId
            }]
          }
          googleDrive(accessToken).files().insert(folder, {},  function(err, response, body) {
            body = JSON.parse(body);
          });
          responseStream.emit('data',body.items[0]);
        }else{
          responseStream.emit('data',body.items[0]);
        }
      }
    });
    return responseStream;
  }

  AttachmentProcessor.prototype.SaveDocument = function(accessToken){

  }

  return new AttachmentProcessor();
}
