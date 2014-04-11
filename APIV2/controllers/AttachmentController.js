//Require Statements
var Stream = require('stream');
var controller = require('./Controller.js');
var TagsController = require('./TagsController.js')
module.exports = function(){
  'use strict';
  var _responseStream = new Stream();

  function Attachment(settings){
    this.tags = new TagsController();
  }


  Attachment.prototype = new controller();

  /* ========================================================================================================
   *
   * Read Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

  Attachment.prototype.getAttachments = function(ids){
    return this.GetNodes(ids);
  }



  Attachment.prototype.getAttachment = function(id){
    var query =  [
      'START attachment=node('+id+')',
      'RETURN attachment'
    ];
    var emitter = new Stream();
    var queryStream = this.executeQuery(query.join('\n'),{});
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
    var context = this;
    var tagger = this.tags;
    var resultStream  = new Stream();
    this.storeAttachment('Attachment',data)
    .once('data',function(results){
      var attachmentId = results[0].n.id;
      attachment = results[0].n;
      context.linkOwner.call(context,attachmentId,token)
      .on('data',function(results){
        if(tags.length === 0){
          resultStream.emit('data',attachment);
        }else{
          var tagStream = tagger.TagEntity(attachmentId,tags);
          tagStream.once('TagEntity.done',function(results){
            resultStream.emit('data',attachment);
          });
        }
      })
      .on('error',function(error){
        error.function = 'linkOwner'
        resultStream.emit('error',error);
      })
    })
    .on('error',function(error){
      resultStream.emit('error',error);
    })
    return resultStream;
  }

  Attachment.prototype.createAttachment= function(data,token,tags,sectionId){
    var resultStream = new Stream();
    var context = this;
    var createAttachmentReturn = new Stream();
    this.createAttachmentBase(data,token,tags)
    .on('data',function(results){
      var linkStream = context.linkSection.call(context,sectionId,results.id)
      .on('data',function(results){
        createAttachmentReturn.emit('data',results);
      })
      .on('error',function(error){
        error.function = 'linkSection'
        createAttachmentReturn.emit('error',error);
      })
      })
    .on('error',function(error){
      createAttachmentReturn.emit('error',error)
    })
    return createAttachmentReturn;
  }

  Attachment.prototype.deleteAttachment = function(id){
    var responseStream = new Stream();
    var query = ['START link=node('+id+')',
                 'SET link.isDeleted = true',
                 'RETURN link'];
    var queryStream = this.executeQuery(query.join('\n'),{});
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
    var queryStream = this.executeQuery(query.join('\n'),{});
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
    var relStream = this.executeQuery(query.join('\n'),variableHash);
    return relStream;
  }

  Attachment.prototype.storeAttachment= function(attachmentType,data){
    var query = 'CREATE (n:'+attachmentType+' {data}) RETURN n';
    var variableHash = {data:data};
    var queryStream = this.executeQuery(query,variableHash);
    var emitter = this;
    var resultStream =new  Stream();
    queryStream.on('data',function(results){
      resultStream.emit('data',results)
    })
    .on('error',function(error){
      error.function = 'StoreAttachment'
      resultStream.emit('error',error);
    })
    return resultStream;
  }


  //
  Attachment.prototype.updateAttachment = function(attachment,id){
    var query = ['START attachment=node('+id+') SET'];
    var variableHash = {}
    var counter = 0;
    for(var key in attachment.data){
      counter++;
      if(attachment.data[key] !== null){
        var str = 'attachment.'+key+' = {'+key+'}';
        variableHash[key] = attachment.data[key]
        if(counter < Object.keys(attachment.data).length){
          query.push(str+',')
        }
        else{
          query.push(str)

        }
      }
    }
    query.push('RETURN attachment');
    return this.executeQuery(query.join('\n'),variableHash);

  }

  Attachment.prototype.FormatObject= function(dbAtt,sectionId){
    return {
      id:dbAtt.id,
      data:dbAtt.data
    }
  }

  return new Attachment();
}