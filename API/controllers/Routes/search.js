var SearchController = require('./../search_controller.js');
var controller = new SearchController();
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
    app.get('/search', function(req, res, next) {

      controller.search(req.user,req.query.query)
      console.log(req)
    });
};
