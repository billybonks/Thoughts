var ApplicationController = require('./../Application')();
var UserController = require('./../UserController')();
var CardController = require('./../CardController')();
var ErrorHandler = require('./../../lib/Errors.js');
module.exports = function (app) {
  'use strict';
  /* ========================================================================================================
   *
   * Application Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

  app.get('/applications/:id',function (req,res,next){
    var response = ApplicationController.GetApplication(req.headers.authorization);
    response.on('data',function(results){
      if(results.length > 0){
        var application = ApplicationController.FormatObject(results[0].n);
      }else{
        //404 error
      }
      UserController.GetUser(req.headers.authorization).on('data',function(results){
        if(!results[0]){
          res.status = 200;
          res.returnData ={application:{id:0,name:'guest',token:null}}
          next();
        }else{
          var user = UserController.FormatObject(results[0].user);
          res.status = 200;
          res.returnData ={application:application,user:user};
          next();
        }
      });
    });
  });

}