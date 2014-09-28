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
    /**
     * gets list of attachment based on ids.
     * @param {id} Array  array of  attachment ids to retrive
     * @return
     */
    Attachment.prototype.getAttachments = function(ids) {
        return this.getNodes(ids);
    }

    /**
     * gets attachment based on id.
     * @param {id} String id of attachment to retrive
     * @return
     */
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

    /**
     * Creates attachment node.
     * @param {attachment} Object vector data
     * @return
     */
    //FIXME: replace paramters with attachment object
    //FIXME: use attachment model
    Attachment.prototype.createAttachment = function(data, id, tags, cardId) {
        var attachment = null;
        var context = this;
        var tagger = this.tags;
        return Promise.call(this, function(resolve, reject) {
            this.createNode(data, 'Attachment').then(function(data) {
                var attachmentId = results[0].node.id;
                attachment = results[0].node;
                context.createRelationShip(id, attachmentId, 'Created').then(function(results) {
                    console.log('owner linked')
                    if (tags.length === 0) {
                        resolve(attachment);
                    } else {
                        tagger.TagEntity(attachmentId, tags).then(function(results) {
                            context.createRelationShip(results.id, cardId, 'Attached').then(function() {
                                var attachment = AttachmentController.FormatObject(attachment, cardId)
                                resolve(attachment);
                            }, error(reject));
                        }, error(reject))
                    }
                }, error(reject))
            }, error(reject))
        });
    }

    /**
     * Gets attachments attached to card.
     * @param {cardId} String id of target card
     * @return
     */
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

    /**
     * Updates attachment .
     * @param {attachment} Object vector data
     * @param {id} String id of target attachment
     * @return
     */
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

    //FIXME: delete once attachment object is created
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
