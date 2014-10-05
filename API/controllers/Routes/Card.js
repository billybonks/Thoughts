var cardController = require('./../CardController');
var controller = new cardController();
var TryParse = require('./../../lib/TryParse');
var Stream = require('stream');
var ErrorHandler = require('./../../lib/Errors.js');
var RSVP = require('rsvp');
module.exports = function(app) {
    'use strict';
    /* ========================================================================================================
     *
     * Card Methods - Keep in alphabetical order
     *
     * ===================================================================================================== */

    app.delete('/cards/:id', function(req, res, next) {
        controller.deleteCard(req.params.id).then(function(results) {
            res.status = 200;
            res.returnData = {}
            next();
        }, ErrorHandler.error(res, next));
    });

    app.get('/cards', function(req, res, next) {
        var ids = req.query.ids;
        if (ids) {
            var promises = [];
            for (var i = 0; i < ids.length; i++) {
                promises.push(controller.getCard(ids[i]));
            }
            RSVP.Promise.all(promises).then(function(cards) {
                res.payload = cards;
                next();
            }, ErrorHandler.error(res, next))
        } else {
            var ret = [];
            controller.getAllCards(req.user).then(function(cards) {
                res.payload = cards;
                next();
            }, ErrorHandler.error(res, next))
        }
    });

    app.get('/cards/:id', function(req, res, next) {
        controller.getCard(req.params.id).then(function(card) {
            res.payload = card;
            next();
        }, ErrorHandler.error(res, next));
    });

    app.post('/cards', function(req, res, next) {
        var promise;
        if (!isNaN(req.model.type)) {
            var template = card.type;
            delete card.type;
            var props = {
                isTemplate: false,
                onMainDisplay: true,
                title: card.title
            }
            if (parents.length !== 0) {
                props.onMainDisplay = false;
            }
            promise = controller.duplicateCard(template, req.user, true, null, props);
        } else {
            promise = controller.createCard(req.user, req.model)
        }
        promise.then(function(results) {
            res.payload = results;
            next();
        }, ErrorHandler.error(res, next));
    });

    app.put('/cards/:id', function(req, res, next) {
        controller.updateCard(req.body.card, req.params.id).then(function(results) {
            res.status = 200;
            res.returnData = {}
            next();
        }, ErrorHandler.error(res, next));
    });
};
