//Require Statements
var Stream = require('stream');
var controller = require('./Controller.js');
var TagsController = require('./TagsController.js')
var ErrorHandler = require('./../lib/Errors.js');

module.exports = function() {
  'use strict';
  var _responseStream = new Stream();

  function Attachment(settings) {
    this.tags = new TagsController();
  }


  Attachment.prototype = new controller();

  /* ========================================================================================================
   *
   * Read Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

  Attachment.prototype.getAttachments = function(ids) {
    return this.GetNodes(ids);
  }



  Attachment.prototype.getAttachment = function(id) {
    var query = [
      'START attachment=node(' + id + ')',
      'RETURN attachment'
    ];
    var emitter = new Stream();
    var queryStream = this.executeQuery(query.join('\n'), {});
    ErrorHandler.HandleResponse(queryStream, emitter, 'GetAttachment');
    return emitter;
  }

  /* ========================================================================================================
   *
   * Write Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */


  Attachment.prototype.createAttachmentBase = function(data, token, tags) {
    var attachment = null;
    var context = this;
    var tagger = this.tags;
    var resultStream = new Stream();
    this.storeAttachment('Attachment', data)
      .on('data', function(results) {
        var attachmentId = results[0].n.id;
        attachment = results[0].n;
        context.linkOwner.call(context, attachmentId, token)
          .on('data', function(results) {
            if (tags.length === 0) {
              resultStream.emit('data', attachment);
            } else {
              tagger.TagEntity(attachmentId, tags).then(function(results) {
                resultStream.emit('data', attachment);
              }, function() {})
            }
          }) //handle link ownder
        .on('error', function(error) {
          resultStream.emit('error', error)
        })
      }) //handle store attachmetn
    .on('error', function(error) {
      resultStream.emit('error', error)
    })
    return resultStream;
  }

  Attachment.prototype.createAttachment = function(data, token, tags, sectionId) {
    var resultStream = new Stream();
    var context = this;
    var createAttachmentReturn = new Stream();
    this.createAttachmentBase(data, token, tags)
      .on('data', function(results) {
        var linkStream = context.linkSection.call(context, sectionId, results.id)
          .on('data', function(results) {
            createAttachmentReturn.emit('data', results);
          }).on('error', function(error) {
            resultStream.emit('error', error)
          }); //Handle Link Section
      }).on('error', function(error) {
        resultStream.emit('error', error)
      }); //Handle Base Create Att
    return createAttachmentReturn;
  }

  Attachment.prototype.deleteAttachment = function(id) {
    var responseStream = new Stream();
    var query = ['START link=node(' + id + ')',
      'SET link.isDeleted = true',
      'RETURN link'
    ];
    var queryStream = this.executeQuery(query.join('\n'), {});
    ErrorHandler.HandleResponse(queryStream, responseStream, 'DeleteAttachment');
    return responseStream;
  }

  Attachment.prototype.GetCardsAttachments = function(cardId) {
    var responseStream = new Stream();
    var query = [
      'Start card=node(' + cardId + ')',
      'MATCH  (attachment)-[a:Attached]->(card)',
      'WHERE not(has(attachment.isDeleted))',
      'RETURN attachment'
    ]
    var queryStream = this.executeQuery(query.join('\n'), {});
    ErrorHandler.HandleResponse(queryStream, responseStream, 'GetCardsAttachments');
    return responseStream;
  }


  Attachment.prototype.linkSection = function(sectionID, attachmentId) {
    var responseStream = new Stream();
    var query = [
      'START attachment=node(' + attachmentId + '),section=node(' + sectionID + ')',
      'CREATE attachment-[r:Attached]->section',
      'RETURN attachment'
    ];
    var queryStream = this.executeQuery(query.join('\n'), {});
    ErrorHandler.HandleResponse(queryStream, responseStream, 'LinkSection');
    return responseStream;
  }

  Attachment.prototype.linkOwner = function(attachmentId, sessionToken) {
    var responseStream = new Stream();
    var query = [
      'START attachment=node(' + attachmentId + ')',
      'MATCH (user:Person)',
      'WHERE user.session_token = {token}',
      'CREATE user-[r:Created]->attachment',
      'RETURN attachment'
    ];
    var variableHash = {
      token: sessionToken
    }
    var queryStream = this.executeQuery(query.join('\n'), variableHash);
    ErrorHandler.HandleResponse(queryStream, responseStream, 'LinkAttachmentOwner');
    return responseStream;
  }

  Attachment.prototype.storeAttachment = function(attachmentType, data) {
    var responseStream = new Stream();
    var query = 'CREATE (n:' + attachmentType + ' {data}) RETURN n';
    data.date_created = Date.now();
    data.date_modified = Date.now();
    var variableHash = {
      data: data
    };
    var queryStream = this.executeQuery(query, variableHash);
    var emitter = this;
    ErrorHandler.HandleResponse(queryStream, responseStream, 'StoreAttachmentOwner');
    return responseStream;
  }


  //
  Attachment.prototype.updateAttachment = function(attachment, id) {
    var responseStream = new Stream();
    var query = ['START attachment=node(' + id + ') SET'];
    var variableHash = {
      date_modified: Date.now()
    }
    var counter = 0;
    for (var key in attachment.data) {
      counter++;
      if (attachment.data[key] !== null) {
        var str = 'attachment.' + key + ' = {' + key + '}';
        variableHash[key] = attachment.data[key]
        query.push(str + ',')
      }
    }
    query.push('attachment.date_modified = {date_modified}')
    query.push('RETURN attachment');
    ErrorHandler.HandleResponse(this.executeQuery(query.join('\n'), variableHash), responseStream, 'UpdateAttachment');
    return responseStream;
  }

  Attachment.prototype.FormatObject = function(dbAtt, cardId) {

    var data = {}
    for (var key in dbAtt.data) {
      if (key === 'date_created' || key === 'date_modified') {
        continue;
      }
      if (dbAtt.data.hasOwnProperty(key))
        data[key] = dbAtt.data[key];
    }
    var att = {
      id: dbAtt.id,
      data: data,
      card: cardId
    }

    att.date_created = dbAtt.data.date_created;
    att.date_modified = dbAtt.data.date_modified;
    return att;
  }

  return new Attachment();
}
