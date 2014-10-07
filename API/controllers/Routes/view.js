var ViewController = require('./../view_controller.js');
var controller = new ViewController();
var ErrorHandler = require('./../../lib/Errors.js');
var utils = require('./../../lib/utils');
module.exports = function(app) {
    'use strict';
    /* ========================================================================================================
     *
     * User Methods - Keep in alphabetical order
     *
     * ===================================================================================================== */
    //FIXME:TEST ME
    app.get('/views', function(req, res, next) {
        controller.getViews(req.user).then(function(views) {
            var defaultView = utils.filter(views, 'default', true);
            controller.loadPage(defaultView, defaultView.get('lastPage') + 1, req.user).then(function(cards) {
                defaultView.set('cards', cards);
                defaultView.set('lastPage', defaultView.get('lastPage') + 1);
                res.payload = views;
                next();
            }, ErrorHandler.error(res, next));
        }, ErrorHandler.error(res, next));
    });

    app.get('/views/more', function(req, res, next) {
        controller.getView(parseInt(req.query.id)).then(function(view) {
            controller.loadPage(view, req.query.page, req.user).then(function(cards) {
                res.status = 200;
                res.returnData = {
                    cards:utils.arrayToJSON(cards)
                };
                next();
            }, ErrorHandler.error(res, next));
        }, ErrorHandler.error(res, next));
    });
};
