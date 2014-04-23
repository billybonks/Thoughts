
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
  AttachmentProcessor.prototype.ProccessAttatchment=function(attachment,user){

    var methodName = 'Process'+attachment.type
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
        console.log(attachment)
        returnStream.emit('data',attachment);
      }, 100,returnStream);
    }
    return returnStream;
  }


  /* ========================================================================================================
   *
   * Generated Methods
   *
   * ===================================================================================================== */
  AttachmentProcessor.prototype.ProcessList = function(attachment,user){

    var href = attachment.data.link;
    var responseStream = new Stream();
    if(typeof href  == 'undefined'){
      console.log('timer')
      setTimeout(function() {
        responseStream.emit('data',attachment.data);
      }, 100,responseStream);
    }else{
      console.log('rq')
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
        console.log('emitting data')
        responseStream.emit('data',data);
      });
    }
    return responseStream;
  }


  AttachmentProcessor.prototype.ProcessImage = function(attachment,user){
    console.log('saving image')
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
      console.log('saved')
      data = {
        image:path+'/'+name
      }
      resultStream.emit('data',data);
    });
    return resultStream;
  }

  AttachmentProcessor.prototype.ProcessDocuments = function(attachment,user){
    var resultStream = new Stream();
    var context = this;
    Google.RefreshAccessToken(user.accounts.Google.refresh_token,user.id)
    .on('data',function(access_token){
      console.log('finding route')
      context.FindRoot(access_token).on('data',function(rootId){
        context.FindAttachmentFolder(access_token,attachment.sectionid,rootId).on('data',function(parentFolder){
          if(attachment.data.type === ""){
            var mimeType ='application/vnd.google-apps.document'//mime.lookup(attachment.data.title);
            attachment.data.data = attachment.data.data.replace('data:;','data:'+mimeType+';');
            attachment.data.type = mimeType
          }
          var regex = /^data:.+\/(.+);base64,(.*)$/;
          var matches = attachment.data.data.match(regex);
          var ext = matches[1];
          var data = matches[2];
          var buffer = new Buffer(data, 'base64');
          var options = {
            url: 'https://www.googleapis.com/upload/drive/v2/files?uploadType=media',
            method:'POST',
            headers: {
              Authorization:('Bearer '+access_token),
              'Content-Type':attachment.data.type,
              'Content-Length':buffer.length
            },
           body:buffer
          }
          request(options,function(error, response, body) {
            console.log(error);
            console.log(body);
            var body = JSON.parse(body);
            body.title = attachment.data.title;
            body.parents.push(parentFolder);
            var options = {
               url: 'https://www.googleapis.com/drive/v2/files/'+body.id,
              method:'PUT',
              headers: {
                Authorization:('Bearer '+access_token),
              },
              json:body
            }
            console.log(attachment.data.title)
            console.log(options)
            request(options,function(error, response, body) {
              console.log(parentFolder)
              console.log('done')
              console.log(body)
             var data = {
                link:body.webContentLink,
                foreign_id:body.id,
                title:body.title,
                downloadUrl:body.title,
               thumbnailLink:body.thumbnailLink
              }
              resultStream.emit('data',data);
            });
          });
        })
      }).on('error', function(error){
      })
    })
    return resultStream;
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
                                            console.log(response);
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
          console.log();
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
