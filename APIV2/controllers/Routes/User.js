var User = require('./../User.js')();

module.exports = function (app) {
  'use strict';
  /* ========================================================================================================
   *
   * User Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

  app.get('/users/:id',function (req,res){
    var id = req.params.id;
    User.GetUser(id).on('data',function(results){
      res.json({user:User.FormatObject(results[0].user)});
    });


  });

};
