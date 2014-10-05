'use strict';
var Controller = require('./controller.js');
var error = require('./../lib/Errors.js').reject;
var Promise = require('./../lib/promise')
var model = require('./../models/template');

module.exports = Controller.extend({
  /**
   * Gets all templates that a user has subscribed to
   * @param {user} User model
   * @return
   */
  //FIXME:Should fetched templates that user is subscribed to
  GetTemplates:function(user) {
      return Promise.call(this, function(resolve, reject) {
          var query = ['match (node:Card)',
              'where node.isTemplate = true',
              'AND not(has(node.isDeleted))',
              'return node'
          ].join('\n');
          return this.executeQuery(query, {}).then(function(results) {
              var ret = [];
              for (var i = 0; i < results.length; i++) {
                  var template = new model();
                  template.parse(results[i])
                  ret.push(template)
              }
              resolve(ret);
          }, error(reject));
      });
  }
});
/*
Card.prototype.duplicateCard = function(baseCard, user, duplicateAttatchments, parentId, variablesToReplace) {
    return Promise.call(this, function(fin, reject) {
        var context = this;

        this.getCard(baseCard).then(function(payload) {

            var children = payload.children;
            var attachments = payload.attachments;
            var configurations = payload.configurations;
            var tags = card.tags;

            var card = context.FormatObject(payload.user, payload.tags, payload.children, payload.card, payload.attachments, payload.parents, payload.configurations)



            delete card.user;
            delete card.id;
            delete card.configurations;
            delete card.attachments;
            delete card.children;
            delete card.parents;
            delete card.tags;

            var newAttachments = {};
            var newChildren = {};
            var newConfiguration = {};

            for (var property in variablesToReplace) {
                if (card.hasOwnProperty(property)) {
                    card[property] = variablesToReplace[property];
                }
            }
            //RSVP.Promise.all(promises)
            context.createCard(user, card, tags).then(function(root) {
                context.tagController.tagEntity(tags, root.id).then(function(tags) {
                    var tagHash = {};
                    for (var tag in tags) {
                        tagHash[tags[tag].tag.id] = tags[tag].tag;
                    }
                    Promise.call(this, function(resolve, reject) {
                        var promises = [];
                        if (parentId) {
                            for (var config in configurations) {
                                var configures = configurations[config].configures;
                                delete configurations[config].for;
                                delete configurations[config].configures;
                                delete configurations[config].id;
                                promises.push(context.config.createCardConfiguartion(root.id, parentId, configurations[config]));
                            }
                            RSVP.Promise.all(promises).then(function(configurations) {
                                for (var i = 0; i < configurations.length; i++) {
                                    newConfiguration[configurations[i].id] = configurations[i];
                                }
                            })
                        } else {
                            resolve();
                        }
                    }).then(function() {
                        Promise.call(this, function(resolve, reject) {
                            if (card.attachments.length === 0) {
                                resolve();
                            }
                            var promises = [];
                            if (duplicateAttatchments) {
                                for (var id in attachments) {
                                    //FIXME: this takes user id now not token
                                    promises.push(context.attachmentController.createAttachment(attachments[id].data, token, [], root.id))
                                }
                                RSVP.Promise.all(promises).then(function(attachments) {
                                    for (var i = 0; i < attachments.length; i++) {
                                        newAttachments[attachments[i].id] = attachments[i];
                                    }
                                    resolve();
                                })
                            } else {
                                resolve();
                            }
                        }).then(function() {
                            var promises = [];
                            Promise.call(this, function(resolve, reject) {
                                if (card.children.length === 0) {
                                    fin(root)
                                }
                                for (var child in children) {
                                    promises.push(context.duplicateCard.call(context, child, user, true, root.id, {
                                        isTemplate: false,
                                        onMainDisplay: false
                                    }))
                                }
                                RSVP.Promise.all(promises).then(function() {
                                    var card = {
                                        id: root.id
                                    };
                                    delete root.id;

                                    card.data = root;
                                    if (parentId == null) {
                                        parentId = {};
                                    } else {
                                        parentId[parentId] = {};
                                    }
                                    card = context.FormatObject(user, tagHash, newChildren, card, newAttachments, parentId, newConfiguration);
                                    fin(card);
                                })
                            });
                        })
                    })
                })
            });
        });
    });
}
*/
