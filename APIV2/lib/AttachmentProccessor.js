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


  /* ========================================================================================================
   *
   * Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  AttachmentProcessor.prototype.ProcessList = function(data,userId){
    console.log(data);
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


  AttachmentProcessor.prototype.ProcessPhotos = function(data,userId){
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
    console.log('p card')
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
