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
    var nodeStream = this.GetNodes(ids);
    var resultStream = new Stream()
    nodeStream.once('GetNodes.done',function(results){
      var ret = []
      for(var i = 0;i < results.length;i++){
        var attachment = {
          data: results[i].n.data,
          id:  results[i].n.id
        }
        console.log(attachment);
        ret.push(attachment);
      }
      resultStream.emit('GetAttachments.done',ret)
    });
    return resultStream;
  }



  Attachment.prototype.getAttachment = function(id){
    var query =  [
      'START attachment=node('+id+')',
      'RETURN attachment'
    ];
    var emitter = new Stream();
    var queryStream = settings.executeQuery(query.join('\n'),{});
    queryStream.on('data',function(results){
      emitter.emit('getAttachment.done',results)
    });
    return emitter;
  }

  /* ========================================================================================================
   *
   * Write Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */


  Attachment.prototype.createAttachmentBase= function(data,token,tags){
    var attachment = null;
    var linkOwner = this.linkOwner
    var tagger = this.tags;
    var resultStream  = new Stream();
    var attachmentStream = this.storeAttachment('Attachment',data);
    attachmentStream.once('StoreAttachment.done',function(results){
      console.log('token ** ' +token);
      var attachmentId = results[0].n.id;
      attachment = results[0].n;

      var relationShipStream = linkOwner(attachmentId,token);
      relationShipStream.on('data',function(results){
        if(tags.length == 0){
          resultStream.emit('data',attachment);
        }else{
          var tagStream = tagger.TagEntity(attachmentId,tags);
          tagStream.once('TagEntity.done',function(results){
            resultStream.emit('data',attachment);
          });
        }
      });
    });
    return resultStream;
  }

  Attachment.prototype.createAttachment= function(data,token,tags,sectionId){
    var resultStream = new Stream();
    var linkSection = this.linkSection;
    var createAttachmentReturn = new Stream();
    var attachmentStream = this.createAttachmentBase(data,token,tags)
    attachmentStream.on('data',function(results){
      console.log('attachments')
      console.log(results)
      var linkStream = linkSection(sectionId,results.id)
      linkStream.on('data',function(results){
        //link card
        console.log('link card')
        console.log(results)
        createAttachmentReturn.emit('data',results);
      })
    });
    return createAttachmentReturn;
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

  Attachment.prototype.linkSection = function(sectionID,attachmentId){
    var query =  [
      'START attachment=node('+attachmentId+'),section=node('+sectionID+')',
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
    var resultStream =new  Stream();
    queryStream.once('data',function(results){
      console.log('attachmentSTored')
      resultStream.emit('StoreAttachment.done',results)
    })
    return resultStream;
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