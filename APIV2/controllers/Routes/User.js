var User = require('./../UserController.js')();

module.exports = function (app) {
  'use strict';
  /* ========================================================================================================
   *
   * User Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

  app.get('/users/:id',function (req,res,next){
    var id = req.params.id;
    User.GetUserById(id).on('data',function(results){
      res.status = 200;
      res.returnData ={user:User.FormatObject(results[0].user)}
      next();
    });


  });

};
