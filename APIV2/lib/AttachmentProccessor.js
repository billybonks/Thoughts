
var Stream = require('stream');
var cheerio = require('cheerio')
var request = require('request')
var url = require('url');
var fs = require('fs');
var mkpath = require('./mkpath');
var uuid = require('node-uuid');

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
  AttachmentProcessor.prototype.ProccessAttatchment=function(attachment,userId){

    var methodName = 'Process'+attachment.type
    var returnStream = new Stream();
    console.log(methodName);
    if(this[methodName]){
      console.log('exists')
      this[methodName](attachment,userId)
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
  AttachmentProcessor.prototype.ProcessList = function(data,userId){

    var href = data.link;
    var responseStream = new Stream();
    if(typeof href  == 'undefined'){
      console.log('timer')
      setTimeout(function() {
        responseStream.emit('data',data);
      }, 100,responseStream);
    }else{
      console.log('rq')
      request(href, function(err, resp, html) {
        if (err){
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


  AttachmentProcessor.prototype.ProcessImage = function(data,userId){
    console.log('saving image')
    var resultStream = new Stream();
    var regex = /^data:.+\/(.+);base64,(.*)$/;
    var matches = data.image.match(regex);
    var ext = matches[1];
    var data = matches[2];
    var buffer = new Buffer(data, 'base64');
    var name = uuid.v4()+'.'+ext;
    var path = '/data/users/'+userId+'/images';
    mkpath.sync('../Client'+path);
    fs.writeFile('../Client'+path+'/'+name, buffer,function(err, written,buffer) {
      console.log('saved')
      data = {
        image:path+'/'+name
      }
      resultStream.emit('data',data);
    });
    return resultStream;
    //
    // var ret = fs.writeSync('../data/users/'+userId+'/images/image_decoded.jpg', buffer,0,buffer.length,0);
  }

  AttachmentProcessor.prototype.ProcessCard=function(data,userId){
    data.left = 0
    data.top = 0
    var auth = data.auth;
    delete data.auth;
    var responseStream = CardController.CreateCard(auth,data,[])
    responseStream.on('data',function(results){
      console.log(results)
    })
  }


  return new AttachmentProcessor();
}
