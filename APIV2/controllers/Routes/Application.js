var ApplicationController = require('./../Application')();
var UserController = require('./../UserController')();
var CardController = require('./../CardController')();
module.exports = function (app) {
  'use strict';
  /* ========================================================================================================
   *
   * Application Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

  app.get('/applications/:id',function (req,res){
    var response = ApplicationController.GetApplication(req.headers.authorization);
    response.on('data',function(results){
      if(results.length > 0){
        var application = ApplicationController.FormatObject(results[0].n);
      }else{
        //404 error
      }
      response =CardController.GetTemplates(req.headers.authorization);
      response.on('data',function(templates){
        UserController.GetUser(req.headers.authorization).on('data',function(results){
          if(!results[0]){
            res.json({application:{id:0,name:'guest',token:-1}});
          }else{
            var user = UserController.FormatObject(results[0].user);
            res.json({application:application,user:user,templates:templates});
          }
        });
      });
    });
  });
};