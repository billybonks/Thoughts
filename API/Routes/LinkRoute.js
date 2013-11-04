//require staements
var attachment = require('./AttatchmentBase.js')
var cheerio = require('cheerio')
var request = require('request')
var url = require('url');

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
  }

  /* ========================================================================================================
   *
   * Write Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

  Link.prototype.DeleteLink=function (req, res){
    this.proccessRequestVariables();
  }

  Link.prototype.UpdateLink=function (req, res){
    //this.proccessRequestVariables();
    console.log('update')
  }

  Link.prototype.CreateLink=function (req,res){
    var responseStream = this.GetLinkTitle(req.body.link.href);
    responseStream.on('error',function(error){})
    responseStream.on('data',function(results){this.createAttatchment('Link',results)})
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
      res.json(link)
      responseStream.emit('data',link);
    });
    return responseStream;
  }
  return new Link()
}
