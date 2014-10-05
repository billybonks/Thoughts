var TagController = require('./../TagsController.js');
var controller = new TagController();
var ErrorHandler = require('./../../lib/Errors.js');

module.exports = function(app) {
    'use strict';
    /* ========================================================================================================
     *
     * Tag Methods - Keep in alphabetical order
     *
     * ===================================================================================================== */
    //works
    app.get('/tags/:id', function(req, res, next) {
        controller.getTags([req.params.id]).then(function(data) {
            res.payload = data[0];
            next()
        }, ErrorHandler.error(res, next))
    });

    app.get('/tags', function(req, res, next) {
        if (req.query.names) {
            controller.findOrCreate(req.query.names).then(function(tags) {
                res.payload = tags;
                next();
            }, ErrorHandler.error(res, next))
        } else {
            controller.getTags(req.query.ids).then(function(tags) {
                res.payload = tags;
                next();
            }, ErrorHandler.error(res, next))
        }
    });

    //never used
    app.post('/tags', function(req, res) {
        res.json(req.body);
    });

};
