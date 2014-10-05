var ApplicationController = require('./../ApplicationController');
var controller = new ApplicationController();
var ErrorHandler = require('./../../lib/Errors.js');
module.exports = function (app) {
  'use strict';
  /* ========================================================================================================
   *
   * Application Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

  app.get('/applications/:id',function (req,res,next){
    controller.getApplication(req.user).then(function(application){
      if(application){
        res.status = 200;
        res.returnData ={application:application.getJSON(),user:req.user.getJSON()};
        next();
      }else{
        res.status = 200;
        res.returnData ={application:{id:0,name:'guest',token:null}}
        next();
      }
    });
  });

}
