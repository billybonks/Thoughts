var ViewController = require('./../view_controller.js');
var controller = new ViewController();
var ErrorHandler = require('./../../lib/Errors.js');

module.exports = function (app) {
  'use strict';
  /* ========================================================================================================
   *
   * User Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  //FIXME:TEST ME
  app.get('/cars',function (req,res,next){
    controller.getViews(req.user).then(function(views){
      res.payload = views;
      next();
    },ErrorHandler.error(res,next));
  });
};
