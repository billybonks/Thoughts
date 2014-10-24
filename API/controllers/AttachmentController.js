'use strict';
var Controller = require('./controller.js');
var TagsController = require('./TagsController.js')
var Promise = require('./../lib/promise')
var error = require('./../lib/Errors.js').reject;
var Model = require('./../models/attachment')

module.exports = Controller.extend({
    needs: ['tag'],
    /**
     * gets list of attachment based on ids.
     * @param {id} Array  array of  attachment ids to retrive
     * @return
     */
    getAttachments: function(ids) {
        return Promise.call(this, function(resolve, reject) {
          var query = [this.buildStartStatement(ids)
                      ,'MATCH  (node)-[a:Attached]->(card)'
                      ,'Return node,card']
          query = query.join('\n')
            this.executeQuery(query, {}).then(function(results) {
              var attachment = new Model();
              var ret = attachment.parseMutliArray(results,Model);
              resolve(ret);
            });
        });
    },
    /**
     * gets attachment based on id.
     * @param {id} String id of attachment to retrive
     * @return
     */
    getAttachment: function(id) {
        return Promise.call(this, function(resolve, reject) {
            var query = [
                'START attachment=node(' + id + ')',
                'RETURN attachment'
            ];
            var queryStream = this.executeQuery(query.join('\n'), {}).then(function(results) {
                var attachment = new Model();
                attachment.parse(results[i])
                resolve(attachment);
            }, error(reject));
        });
    },
    /**
     * Creates attachment node.
     * @param {attachment} Object vector data
     * @return
     */
    //FIXME: Prepare model should set relationships as there respective models and not just set id
    createAttachment: function(attachment, user) {
        var context = this;
        var tagger = this.tags;
        return Promise.call(this, function(resolve, reject) {
            this.createNode(attachment.getVectorData(), 'Attachment').then(function(data) {
                attachment.set('id', data[0].node.id)
                context.createRelationShip(user.get('id'), attachment.get('id'), 'Created').then(function(results) {
                    context.createRelationShip(attachment.get('id'), attachment.get('card'), 'Attached').then(function() {
                        if (attachment.get('tags').length === 0) {
                            resolve(attachment);
                        } else {
                            tagger.tagEntity(attachmentId, attachment.get('tags')).then(function(results) {
                                resolve(attachment);
                            }, error(reject))
                        }
                    }, error(reject));

                }, error(reject))
            }, error(reject))
        });
    },
    /**
     * Gets attachments attached to card.
     * @param {cardId} String id of target card
     * @return
     */
    GetCardsAttachments: function(cardId) {
        return Promise.call(this, function(resolve, reject) {
            var context = this;
            var query = [
                'Start card=node(' + cardId + ')',
                'MATCH  (node)-[a:Attached]->(card)',
                'WHERE not(has(node.isDeleted))',
                'RETURN node'
            ]
            var queryStream = this.executeQuery(query.join('\n'), {}).then(function(results) {
                var ret = [];
                for (var i = 0; i < results.length; i++) {
                    var attachment = new Model();
                    attachment.parse(results[i])
                    ret.push(attachment);
                }
                resolve(ret);
            }, error(reject))
        });
    },
    /**
     * Updates attachment .
     * @param {attachment} Object vector data
     * @param {id} String id of target attachment
     * @return
     */
    //FIXME:Should use inherited update method
    updateAttachment: function(attachment, id) {
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
            this.executeQuery(query.join('\n'), variableHash).then(function(results) {
                resolve(results[0]);
            }, error(reject))
        });
    },
    deleteAttachment:function(id){
      return Promise.call(this, function(resolve, reject) {
        var query = ['START node=node(' + id + ')',
                     'MATCH  (node)-[a:Attached]->(card)',
                     'MATCH  (node)<-[c:Created]-(user)',
                     'DELETE a,c,node'];
        this.executeQuery(query.join('\n'),{}).then(function(results) {
            resolve();
        }, error(reject))
      });
    }
});
