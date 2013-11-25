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
    this.once('GetNodes.done',function(results){

      var ret = []
      for(var i = 0;i < results.length;i++){
        var attachment = {
          data: results[i].n.data,
          id:  results[i].n.id
        }
        console.log(attachment);
        ret.push(attachment);
      }
      this.emit('GetAttachments.done',ret)
    });
    this.GetNodes(ids);
  }



  Attachment.prototype.getAttachment = function(id){
    var query =  [
      'START attachment=node('+id+')',
      'RETURN attachment'
    ];
    var emitter = this;
    var queryStream = settings.executeQuery(query.join('\n'),{});
    queryStream.on('data',function(results){
      emitter.emit('getAttachment.done',results)
    });
  }

  /* ========================================================================================================
   *
   * Write Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */


  Attachment.prototype.createAttachmentBase= function(attachmentType,data,token,tags){
    var attachment = null;
    var linkOwner = this.linkOwner
    var tagger = this.tags;
    var emitter = this
    this.tags.once('TagEntity.done',function(results){
      emitter.emit('createAttachmentBase.done',attachment);
    });

    this.once('StoreAttachment.done',function(results){
      console.log('token ** ' +token);
      var attachmentId = results[0].n.id;
      attachment = results[0].n;

      var relationShipStream = linkOwner(attachmentId,token);
      relationShipStream.on('data',function(results){
        if(tags.length == 0){
          emitter.emit('createAttachmentBase.done',attachment);
        }else{
          tagger.TagEntity(attachmentId,tags)
        }
      });
    });
    var attachmentStream = this.storeAttachment('Attachment',data);
  }

  Attachment.prototype.createAttachment= function(attachmentType,data,token,tags,sectionId){
    var resultStream = new Stream();
    var linkSection = this.linkSection;
    var emitter = this;
    this.once('createAttachmentBase.done',function(results){
      console.log('attachments')
      console.log(results)
      var linkStream = linkSection(sectionId,results.id)
      linkStream.on('data',function(results){
        //link card
        console.log('link card')
        console.log(results)
        emitter.emit('createAttachment.done',results);
      })
    })
    var attachmentStream = this.createAttachmentBase(attachmentType,data,token,tags)
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

  Attachment.prototype.linkSection = function(cardId,attachmentId){
    var query =  [
      'START attachment=node('+attachmentId+'),section=node('+cardId+')',
      'CREATE attachment-[r:Attached]->section',
      'RETURN attachment'
    ];
    console.log('query')
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
    console.log('linking owner')
    var variableHash = {token:sessionToken}
    var relStream = settings.executeQuery(query.join('\n'),variableHash);
    return relStream;
  }

  Attachment.prototype.storeAttachment= function(attachmentType,data){
    var query = 'CREATE (n:'+attachmentType+' {data}) RETURN n';
    var variableHash = {data:data};
    var queryStream = settings.executeQuery(query,variableHash);
    var emitter = this;
    queryStream.once('data',function(results){
      console.log('attachmentSTored')
      emitter.emit('StoreAttachment.done',results)
    })
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