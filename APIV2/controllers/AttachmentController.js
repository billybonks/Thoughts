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

    var nodeStream = this.GetNodes(ids);
    var resultStream = new Stream()
    nodeStream.once('data',function(results){
      var ret = []
      for(var i = 0;i < results.length;i++){
        var attachment = {
          data: results[i].n.data,
          id:  results[i].n.id
        }
        console.log(attachment);
        ret.push(attachment);
      }
      resultStream.emit('data',ret)
    });
    return resultStream;
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
    var attachmentStream = this.storeAttachment('Attachment',data);
    attachmentStream.once('StoreAttachment.done',function(results){
      console.log('token ** ' +token);
      var attachmentId = results[0].n.id;
      attachment = results[0].n;

      var relationShipStream = context.linkOwner.call(context,attachmentId,token);
      relationShipStream.on('data',function(results){
        if(tags.length === 0){
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
    var context = this;
    var createAttachmentReturn = new Stream();
    var attachmentStream = this.createAttachmentBase(data,token,tags)
    attachmentStream.on('data',function(results){
      console.log('attachments')
      console.log(results)
      var linkStream = context.linkSection.call(context,sectionId,results.id)
      linkStream.on('data',function(results){
        var attachment = {attachment:{id:results[0].attachment.id,
                                      data:results[0].attachment.data,
                                      section:sectionId}};
        console.log(results);
        createAttachmentReturn.emit('data',attachment);
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
    console.log('query')
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
    queryStream.once('data',function(results){
      console.log('attachmentSTored')
      resultStream.emit('StoreAttachment.done',results)
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
        if(counter < Object.keys(attachment.data).length){
          query.push(str+',')
        }
        else{
          query.push(str)
          variableHash[key] = attachment.data[key]
        }
      }
    }
    query.push('RETURN attachment')
    console.log(query.join('\n'))
    console.log(variableHash.question)
    var resultStream = new Stream();

    var queryStream = this.executeQuery(query.join('\n'),variableHash);
    queryStream.on('data',function(results){
      console.log(results)
      resultStream.emit('done',results)
    })
    return resultStream;
  }

  return new Attachment();
}