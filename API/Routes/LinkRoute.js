//require staements
var attachment = require('./AttatchmentRoute.js')
var cheerio = require('cheerio')
var request = require('request')
var url = require('url');
var Stream = require('stream');

module.exports = function(settings){

  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */

  function Link(){
    // this.lol();
  }

  Link.prototype = new attachment(settings);


  /* ========================================================================================================
   *
   * Read Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

  Link.prototype.GetAllLinks=function (req, res){
    this.proccessRequestVariables(req,res);
    var query = [
      'MATCH (user:Person)-[Created]->(link:Link)',
      'WHERE user.session_token = {token}',
      'AND (not(has(link.isDeleted)))',
      'RETURN user,link'
    ]
    var variablehash = {token:req.headers['authorization']}
    var queryStream = settings.executeQuery(query.join('\n'),variablehash);
    queryStream.on('data', function (results) {
      var ret = [];
      for(c=0;c<results.length;c++){
        var entry = {
          id: results[c].link.id,
          title: results[c].link.data.title,
          href: results[c].link.data.href,
          user: results[c].user.id,
        }
        ret.push(entry)
      }
      console.log(results);
      console.log(ret);
      res.json({links:ret})
    });
  }

  Link.prototype.GetLink=function (req, res){
    this.proccessRequestVariables();
    this.getAttachment();
  }

  /* ========================================================================================================
   *
   * Write Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  Link.prototype.CreateLink=function (href,token,tags,cardid){

    var returnStream = new Stream();
    var responseStream = this.GetLinkTitle(href);
    var createAttachment = this.createAttachment
    var context = this;
    responseStream.on('error',function(error){})
    responseStream.on('data',function(results){
        console.log('token =='+token)
        var resultStream = createAttachment.call(context,'Link',results,token,tags,cardid);
        resultStream.on('data',function(results){
          returnStream.emit('data',results);
        })
    })
    return returnStream;
  }

  Link.prototype.GetLinkTitle= function(herf){
    var responseStream = new Stream()
    request(herf, function(err, resp, html) {
      if (err){
        responseStream.emit('error',err.code);
      }
      var $ = cheerio.load(html);
      var link = {
        title:$('TITLE').text()?$('TITLE').text():'no title found',
        href : herf
      }
      console.log(link);
      responseStream.emit('data',link);
    });
    return responseStream;
  }
  return new Link()
}
