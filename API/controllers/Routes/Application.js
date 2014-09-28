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
    ApplicationController.GetApplication(req.headers.authorization).then(function(results){
      console.log('Got APP')
      console.log(results)
      if(results.length > 0){
        var application = ApplicationController.FormatObject(results[0].n);
      }else{
        //404 error
      }
      console.log('user gettting')
      UserController.GetUser(req.headers.authorization).then(function(user){
          res.status = 200;
          res.returnData ={application:application,user:user};
          next();
      },function(error){
        console.log(error)
        if(error.statusCode === 404){
          console.log('not found')
          res.status = 200;
          res.returnData ={application:{id:0,name:'guest',token:null}}
          next();
        }else{
          //TODO: Internal server error
        }
      });
    });
  });

}
