//var UserRoute = require('./UserRoute.js')
'use strict';
var TagsController = require('./TagsController.js');
var UserController = require('./UserController.js');
var Controller = require('./controller.js');
var AttachmentController = require('./AttachmentController.js');
var ConfigurationController = require('./ConfigurationController.js');
var ErrorHandler = require('./../lib/Errors.js');
var error = require('./../lib/Errors.js').reject;
var Promise = require('./../lib/promise');
var RSVP = require('rsvp');
var Model = require('./../models/card')

module.exports = Controller.extend({
    needs: ['tag', 'user', 'attachment', 'configuration'],
    user: new UserController(),
    config: new ConfigurationController(),
    tagController: new TagsController(),
    attachmentController: new AttachmentController(),
    getViewsCards: function(view, page, user) {
        return Promise.call(this, function(resolve, reject) {
            var query = [
                'START user=node(0)',
                'MATCH (user:Person)-[Created]->(card:Card)'
            ];
            if (view.get('deleted')) {
                query.push('WHERE has(card.isDeleted)');
            } else {
                query.push('WHERE not(has(card.isDeleted))');
            }
            if (view.get('templates')) {
                query.push('AND card.isTemplate = true');
            } else {
                query.push('AND card.isTemplate = false');
            }
            query.push('RETURN card'); //
            query.push('ORDER BY card.date_modified DESC');
            query.push('SKIP ' + (page * 10));
            query.push('LIMIT 10');
            var context = this;
            if (user != null) {
                var variablehash = {
                    id: user.get('id')
                };
                this.executeQuery(query.join('\n'), {}).then(function(results) {
                    if (results.length === 0) {
                        resolve([])
                    } //
                    var promises = []
                    for (var c = 0; c < results.length; c++) {
                        var id = results[c].card.id;
                        promises.push(context.getCard.call(context, id));
                    }
                    RSVP.Promise.all(promises).then(function(cards) {
                        resolve(cards);
                    })
                }, error(reject));
            } else {
                resolve([])
                /*fixme: error breaks site so resolving
              reject({
                  statusCode: 500,
                  message: 'unauthenticated'
              })*/
            }
        });
    },
    //FIXME:unauthenticated error must be in preroute
    getAllCards: function(user) {
        return Promise.call(this, function(resolve, reject) {
            var query = [
                'START user=node(0)',
                'MATCH (user:Person)-[Created]->(card:Card)',
                'WHERE not(has(card.isDeleted))',
                'AND card.onMainDisplay = true',
                'RETURN card',
                'ORDER BY card.date_created'
            ];
            var context = this;
            if (user != null) {
                var variablehash = {
                    id: user.get('id')
                };
                this.executeQuery(query.join('\n'), {}).then(function(results) {
                    if (results.length === 0) {
                        resolve([])
                    } //
                    var promises = []
                    for (var c = 0; c < results.length; c++) {
                        var id = results[c].card.id;
                        promises.push(context.getCard.call(context, id));
                    }
                    RSVP.Promise.all(promises).then(function(cards) {
                        resolve(cards);
                    })
                }, error(reject));
            } else {
                resolve([])
                /*fixme: error breaks site so resolving
                reject({
                    statusCode: 500,
                    message: 'unauthenticated'
                })*/
            }
        });
    },
    //FIXME Added quick fix to turn tags into array
    getCard: function(id) {
        return Promise.call(this, function(resolve, reject) {
            var context = this;
            var query = [
                'Start node=node(' + id + ')',
                'MATCH (user:Person)-[Created]->(node:Card)',
                'OPTIONAL MATCH  (tags)-[t:Tagged]->(node)',
                'OPTIONAL MATCH  (children)<-[h:Has]-(node)',
                'WHERE not(has(children.isDeleted))',
                'RETURN node,user,children,tags'
            ];
            this.executeQuery(query.join('\n'), {}).then(function(results) {
                if (results.length !== 0) {
                    var card = new Model();
                    card.parseArray(results);
                    context.config.getCardConfigurations(card.get('id')).then(function(configurations) {
                        card.set('configurations', configurations);
                        context.getCardParents.call(context, card.get('id')).then(function(parents) {
                            card.set('parents', parents);
                            context.attachmentController.GetCardsAttachments(card.get('id')).then(function(attachments) {
                                card.set('attachments', attachments);
                                resolve(card);
                            }, error(reject))
                        }, error(reject))
                    }, error(reject));
                } else {
                    reject({
                        statusCode: 404,
                        message: 'unauthenticated'
                    })
                }
            }, error(reject));
        })
    },
    getCardParents: function(id) {
        return Promise.call(this, function(resolve, reject) {
            var context = this;
            var query = [
                'Start card=node(' + id + ')',
                'MATCH  (card)<-[h:Has]-(node)',
                'RETURN node' //user,card,attachment'
            ];
            this.executeQuery(query.join('\n'), {}).then(function(results) {
                var parents = [];
                for (var i = 0; i < results.length; i++) {
                    var card = new Model();
                    card.parse(results[i]);
                    parents.push(card);
                }
                resolve(parents);
            }, error(reject))
        })
    },
    createCard: function(user, model) {
        var context = this;
        return Promise.call(this, function(resolve, reject) {
            model.set('date_created', Date.now());
            model.set('date_modified', Date.now());
            this.createNode(model.getVectorData(), 'Card').then(function(results) {
                model.set('id', results[0].node.id);
                context.createRelationShip(user.get('id'), model.get('id'), 'Created').then(function() {
                    context.tagController.tagEntity(model.get('tags'), model.get('id')).then(function(tags) {
                        model.set('tags', tags)
                        if (model.get('parents').length > 0) {
                            context.createRelationShip(model.get('parents')[0], model.get('id'), 'Has').then(function() {
                                resolve(model);
                            }, error(reject))
                        } else {
                            resolve(model);
                        }
                    }, error(reject));
                }, error(reject));
            }, error(reject));
        });
    },
    deleteCard: function(id) {
        return this.deleteEntity(id);
    },
    updateCard: function(model) {
        return Promise.call(this, function(resolve, reject) {
            model.set('date_modified', Date.now())
            model.save().then(function(results) {
                resolve(results);
            }, error(reject));
        });
    }
});
