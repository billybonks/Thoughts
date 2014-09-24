var ConfigurationController = require('./../ConfigurationController')(); //TemplateRoute
var ErrorHandler = require('./../../lib/Errors.js');
var model = require('./../../models/configuration')();
module.exports = function(app) {
    'use strict';
    /* ========================================================================================================
     *
     * Template Methods - Keep in alphabetical order
     *
     * ===================================================================================================== */
    app.get('/configurations/:id', function(req, res, next) {
        var ids = [req.params.id]
        ConfigurationController.getConfiguration(ids).then(function(data) {
            var ret = []
            for (var key in data) {
                ret.push(data[key]);
            }
            res.status = 200;
            res.returnData = {
                configuration: ret
            }
            next();
        }, ErrorHandler.FowardErrorToBrowser(res, next));

    });

    app.get('/configurations', function(req, res, next) {
        var ret = []
        ConfigurationController.getConfiguration(req.query.ids).then(function(data) {
            for (var key in data) {
                ret.push(data[key]);
            }
            res.status = 200;
            res.returnData = {
                configuration: ret
            }
            next();
        }, ErrorHandler.FowardErrorToBrowser(res, next));
    });

    app.post('/configurations', function(req, res, next) {
        var configuration = new model(req.body.configuration);
        ConfigurationController.createCardConfiguartion(configuration).then(function(configuration) {
            res.status = 200;
            res.returnData = {
                configuration: configuration.data
            }
            next();
        }, ErrorHandler.FowardErrorToBrowser(res, next));
    });


    app.put('/configurations/:id', function(req, res, next) {
        var config = req.body.configuration;
        delete config.for;
        delete config.configures
        ConfigurationController.updateConfiguration(req.params.id, config).then(function(data) {
            res.status = 200;
            //  res.returnData = {configuration:data}
            next();
        }, ErrorHandler.FowardErrorToBrowser(res, next));
    });
};
