//Require Statements
var controller = require('./Controller.js');
var TagsController = require('./TagsController.js')
var Promise = require('./../lib/promise')
var error = require('./../lib/Errors.js').reject;

module.exports = function() {
    'use strict';
    needs: ['tag']

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
        return this.getNodes(ids);
    }



    Attachment.prototype.getAttachment = function(id) {
        return Promise.call(this, function(resolve, reject) {
            var query = [
                'START attachment=node(' + id + ')',
                'RETURN attachment'
            ];
            var queryStream = this.executeQueryRSVP(query.join('\n'), {}).then(function(results) {
                resolve(results);
            }, error(reject));
        });
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
        return Promise.call(this, function(resolve, reject) {
            this.storeAttachment('Attachment', data).then(function(results) {
                var attachmentId = results[0].n.id;
                attachment = results[0].n;
                context.linkOwner.call(context, attachmentId, token).then(function(results) {
                    console.log('owner linked')
                    if (tags.length === 0) {
                        resolve(attachment);
                    } else {
                        tagger.TagEntity(attachmentId, tags).then(function(results) {
                            resolve(attachment);
                        }, function() {})
                    }
                }, error(reject))
            }, error(reject))
        });
    }

    Attachment.prototype.createAttachment = function(data, token, tags, sectionId) {
        return Promise.call(this, function(resolve, reject) {
            var context = this;
            this.createAttachmentBase(data, token, tags).then(function(results) {
                context.createRelationShip(results.id, sectionId, 'Attached').then(function() {
                    resolve(results);
                }, error(reject));
            }, error(reject));
        });
    }

    Attachment.prototype.GetCardsAttachments = function(cardId) {
        return Promise.call(this, function(resolve, reject) {
            var context = this;
            var query = [
                'Start card=node(' + cardId + ')',
                'MATCH  (attachment)-[a:Attached]->(card)',
                'WHERE not(has(attachment.isDeleted))',
                'RETURN attachment'
            ]
            var queryStream = this.executeQueryRSVP(query.join('\n'), {}).then(function(results) {
                var ret = [];

                for (var i = 0; i < results.length; i++) {
                    console.log(results[i].attachment);
                    ret.push(context.FormatObject(results[i].attachment, cardId));
                }
                console.log(ret)
                resolve(ret);
            }, error(reject))
        });
    }

    Attachment.prototype.linkOwner = function(attachmentId, sessionToken) {
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

        return this.executeQueryRSVP(query.join('\n'), variableHash);
    }

    Attachment.prototype.storeAttachment = function(attachmentType, data) {
        return Promise.call(this, function(resolve, reject) {
            var query = 'CREATE (n:' + attachmentType + ' {data}) RETURN n';
            data.date_created = Date.now();
            data.date_modified = Date.now();
            var variableHash = {
                data: data
            };
            this.executeQueryRSVP(query, variableHash).then(function(results) {
                resolve(results);
            }, error(reject))
        });
    }


    //
    Attachment.prototype.updateAttachment = function(attachment, id) {
        return Promise.call(this, function(resolve, reject) {
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
            this.executeQueryRSVP(query.join('\n'), variableHash).then(function(results) {
                resolve(results);
            }, error(reject))
        });
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
