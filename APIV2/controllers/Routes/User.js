var User = require('./../UserController.js')();

module.exports = function (app) {
  'use strict';
  /* ========================================================================================================
   *
   * User Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

  app.get('/users/:id',function (req,res){
    var id = req.params.id;
    User.GetUserById(id).on('data',function(results){
      res.json({user:User.FormatObject(results[0].user)});
    });


  });

};
