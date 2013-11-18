//Require Statements
var Stream = require('stream');
var ServiceModule = require('./ServiceModule.js')
var TagsRoute = require('./TagsRoute.js')
module.exports = function(settings){

  var _responseStream = new Stream();

  function Attachment(settings){
    this.tags = new TagsRoute(settings);
  }


  Attachment.prototype = new ServiceModule(settings);

  /* ========================================================================================================
   *
   * Read Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

  Attachment.prototype.getAttachments = function(ids){

  }

  Attachment.prototype.getAttachment = function(id){
    var resultStream = new Stream();
    var query =  [
      'START attachment=node('+id+')',
      'RETURN attachment'
    ];
    var queryStream = settings.executeQuery(query.join('\n'),{});
    queryStream.on('data',function(results){
      console.log(results)
    });
    return resultStream;
  }

  /* ========================================================================================================
   *
   * Write Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */


  Attachment.prototype.createAttachmentBase= function(attachmentType,data,token,tags){
    var resultStream = new Stream();
     console.log('token ==== ' +token);
    var attachmentStream = this.storeAttachment(attachmentType,data);
    //var token = this.token;
    var linkOwner = this.linkOwner
    var tagger = this.tags;
    attachmentStream.on('data',function(results){
      console.log('token ** ' +token);
      var attachmentId = results[0].n.id;
      var attachment = results[0].n;
      var relationShipStream = linkOwner(attachmentId,token);
      relationShipStream.on('data',function(results){
        var tagStream = tagger.TagEntity(attachmentId,tags)
        tagStream.on('data',function(results){
          resultStream.emit('data',attachment);
        })
      });
    });
    return resultStream;
  }

    Attachment.prototype.createAttachment= function(attachmentType,data,token,tags,cardId){
    var resultStream = new Stream();

    var attachmentStream = this.createAttachmentBase(attachmentType,data,token,tags)
    attachmentStream.on('data',function(results){
      console.log(results)
      var linkStream = this.linkCard(cardId,results.id)
      linkStream.on('data',function(results){
        console.log(results)
        resultStream.emit('data',results);
      })
    })
    return resultStream;
  }

  Attachment.prototype.deleteAttachment = function(id){
    var responseStream = new Stream();
    var query = ['START link=node('+id+')',
                 'SET link.isDeleted = true',
                 'RETURN link'];
    console.log(query.join('\n'));
    var queryStream = settings.executeQuery(query.join('\n'),{});
    queryStream.on('data',function(results){
      responseStream.emit('data',results)
    })
    return responseStream;
  }

  Attachment.prototype.linkCard = function(cardId,attachmentId){
    var query =  [
      'START attachment=node('+attachmentId+'),card=node('+cardId+')',
      'MATCH (card:Card)',
      'CREATE attachment-[r:Attached]->card',
      'RETURN attachment'
    ];
    var queryStream = settings.executeQuery(query.join('\n'),{});
    return queryStream;
  }

  Attachment.prototype.linkOwner = function(attachmentId,sessionToken){
    var query =  [
      'START attachment=node('+attachmentId+')',
      'MATCH (user:Person)',
      'WHERE user.session_token = {token}',
      'CREATE user-[r:Created]->attachment',
      'RETURN attachment'
    ];
    var variableHash = {token:sessionToken}
    var relStream = settings.executeQuery(query.join('\n'),variableHash);
    return relStream;
  }

  Attachment.prototype.storeAttachment= function(attachmentType,data){
    var query = 'CREATE (n:'+attachmentType+' {data}) RETURN n';
    var variableHash = {data:data};
    var queryStream = settings.executeQuery(query,variableHash);
    return queryStream;
  }

  //
  Attachment.prototype.updateAttachment = function(){
    var query = ['START link=node('+req.params.id+')',
                 'SET link.title = {title},',
                 'link.description = {description},',
                 'link.href = {href}',
                 'RETURN link'];
    var variableHash = req.body.link;
    delete variableHash['user'];
    var queryStream = settings.executeQuery(query.join('\n'),variableHash);
    queryStream.on('data',function(results){
      res.json({})
    })
  }

  return new Attachment(settings);
}