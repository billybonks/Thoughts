var UserController = require('./../UserController.js');
var controller = new UserController();
var ErrorHandler = require('./../../lib/Errors.js');

module.exports = function (app) {
  'use strict';
  /* ========================================================================================================
   *
   * User Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  //FIXME:TEST ME
  app.get('/users/:id',function (req,res,next){
    controller.getUserById(req.params.id).then(function(user){
      res.payload = user;
      console.log('Nexting')
      next();
    },ErrorHandler.error(res,next));
  });
};
