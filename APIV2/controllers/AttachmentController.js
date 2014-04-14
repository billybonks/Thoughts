//Require Statements
var Stream = require('stream');
var controller = require('./Controller.js');
var TagsController = require('./TagsController.js')
var ErrorHandler = require('./../lib/Errors.js');

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
    var responseStream;
    ErrorHandler.HandleResponse(this.GetNodes(ids),responseStream,'GetAttachments')
    return responseStream;
  }



  Attachment.prototype.getAttachment = function(id){
    var query =  [
      'START attachment=node('+id+')',
      'RETURN attachment'
    ];
    var emitter = new Stream();
    var queryStream = this.executeQuery(query.join('\n'),{});
    ErrorHandler.HandleResponse(queryStream,emitter,'GetAttachment');
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
          }).on('error',FowardError(resultStream));
        }
      })//handle link ownder
      .on('error',FowardError(resultStream))
    })//handle store attachmetn
    .on('error',FowardError(resultStream))
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
      }).on('error',FowardError(resultStream));//Handle Link Section
    }).on('error',FowardError(resultStream));//Handle Base Create Att
    return createAttachmentReturn;
  }

  Attachment.prototype.deleteAttachment = function(id){
    var responseStream = new Stream();
    var query = ['START link=node('+id+')',
                 'SET link.isDeleted = true',
                 'RETURN link'];
    var queryStream = this.executeQuery(query.join('\n'),{});
    ErrorHandler.HandleResponse(queryStream,responseStream,'DeleteAttachment');
    return responseStream;
  }

  Attachment.prototype.linkSection = function(sectionID,attachmentId){
    var responseStream = new Stream();
    var query =  [
      'START attachment=node('+attachmentId+'),section=node('+sectionID+')',
      'CREATE attachment-[r:Attached]->section',
      'RETURN attachment'
    ];
    var queryStream = this.executeQuery(query.join('\n'),{});
    ErrorHandler.HandleResponse(queryStream,responseStream,'LinkSection');
    return responseStream;
  }

  Attachment.prototype.linkOwner = function(attachmentId,sessionToken){
    var responseStream = new Stream();
    var query =  [
      'START attachment=node('+attachmentId+')',
      'MATCH (user:Person)',
      'WHERE user.session_token = {token}',
      'CREATE user-[r:Created]->attachment',
      'RETURN attachment'
    ];
    var variableHash = {token:sessionToken}
    var queryStream = this.executeQuery(query.join('\n'),variableHash);
    ErrorHandler.HandleResponse(queryStream,responseStream,'LinkAttachmentOwner');
    return responseStream;
  }

  Attachment.prototype.storeAttachment= function(attachmentType,data){
    var responseStream = new Stream();
    var query = 'CREATE (n:'+attachmentType+' {data}) RETURN n';
    var variableHash = {data:data};
    var queryStream = this.executeQuery(query,variableHash);
    var emitter = this;
    var resultStream =new  Stream();
    ErrorHandler.HandleResponse(queryStream,responseStream,'StoreAttachmentOwner');
    return resultStream;
  }


  //
  Attachment.prototype.updateAttachment = function(attachment,id){
    var responseStream = new Stream();
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
    ErrorHandler.HandleResponse(this.executeQuery(query.join('\n'),variableHash),responseStream,'UpdateAttachment');
    return responseStream;
  }

  Attachment.prototype.FormatObject= function(dbAtt,cardId){
    return {
      id:dbAtt.id,
      data:dbAtt.data,
      card:cardId
    }
  }

  return new Attachment();
}