var ConfigurationController = require('./../ConfigurationController')(); //TemplateRoute
var ErrorHandler = require('./../../lib/Errors.js');
module.exports = function(app) {
    'use strict';
    /* ========================================================================================================
     *
     * Template Methods - Keep in alphabetical order
     *
     * ===================================================================================================== */
    app.get('/configurations/:id', function(req, res, next) {
        var ids = [req.params.id]
        ConfigurationController.GetConfiguration(ids).then(function(data) {
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
        console.log('getting IDS')
        var ret = []
        ConfigurationController.GetConfiguration(req.query.ids).then(function(data) {
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
        var config = req.body.configuration;
        var f = config.for;
        var target = config.configures;
        delete config.for;
        delete config.configures;
        ConfigurationController.CreateCardConfiguartion(target, f, config).then(function(data) {
            config.id = data[0].node.id
            config.for = f;
            config.configures = target;
            res.status = 200;
            res.returnData = {
                configuration: config
            }
            next();
        }, ErrorHandler.FowardErrorToBrowser(res, next));
    });


    app.put('/configurations/:id', function(req, res, next) {
        var config = req.body.configuration;
        delete config.for;
        delete config.configures
        ConfigurationController.UpdateConfiguration(req.params.id, config).then(function(data) {
            res.status = 200;
            //  res.returnData = {configuration:data}
            next();
        }, ErrorHandler.FowardErrorToBrowser(res, next));
    });
};
