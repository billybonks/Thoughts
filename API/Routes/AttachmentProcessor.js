var ServiceModule = require('./ServiceModule.js')
var Stream = require('stream');
var cheerio = require('cheerio')
var request = require('request')
var url = require('url');


module.exports = function(settings){
  var CardsRoute = require('./CardsRoute')(settings);
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function AttachmentProcessor(settings){

  }

  AttachmentProcessor.prototype = new ServiceModule(settings);

  /* ========================================================================================================
   *
   * Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

  AttachmentProcessor.prototype.ProcessLinks = function(data){
    var href = data.link;
    console.log('finding title '+href);
    var responseStream = new Stream()
    request(href, function(err, resp, html) {
      if (err){
        responseStream.emit('error',err.code);
      }
      var $ = cheerio.load(html);
      var data = {
        title:$('TITLE').text()?$('TITLE').text():'no title found',
        href : href
      }
      console.log(data)
      responseStream.emit('data',data);
    });
    return responseStream;
  }

  AttachmentProcessor.prototype.ProcessCard=function(data){
    console.log('p card')
    data.left = 0
    data.top = 0
    var auth = data.auth;
    delete data['auth'];
    var responseStream = CardsRoute.CreateCard(auth,data,[])
    responseStream.on('data',function(results){
      console.log(results)
    })
  }
  return new AttachmentProcessor(settings);
}
