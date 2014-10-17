var ConfigurationController = require('./../ConfigurationController');
var controller = new ConfigurationController();
var ErrorHandler = require('./../../lib/Errors.js');
var model = require('./../../models/configuration');
var utils = require('./../../lib/utils.js');
module.exports = function(app) {
    'use strict';
    /* ========================================================================================================
     *
     * Configuration Methods - Keep in alphabetical order
     *
     * ===================================================================================================== */
    app.get('/configurations/:id', function(req, res, next) {
        var ids = [req.params.id]
        controller.getConfiguration(ids).then(function(configurations) {
            res.payload = configurations[0];
            next();
        }, ErrorHandler.error(res, next));

    });

    app.get('/configurations', function(req, res, next) {
        controller.getConfiguration(req.query.ids).then(function(configurations) {
            res.payload = configurations;
            next();
        }, ErrorHandler.error(res, next));
    });

    app.post('/configurations', function(req, res, next) {
        controller.createCardConfiguartion(req.model).then(function(configuration) {
            res.payload = configuration;
            next();
        }, ErrorHandler.error(res, next));
    });


    app.put('/configurations/:id', function(req, res, next) {
        req.model.set('id',req.params.id);
        controller.updateConfiguration(req.model).then(function(configuration) {
            res.payload = configuration;
            next();
        }, ErrorHandler.error(res, next));
    });
};
