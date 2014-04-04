var ConfigurationController = require('./../ConfigurationController')();//TemplateRoute
module.exports = function (app) {
  'use strict';
  /* ========================================================================================================
   *
   * Template Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  app.get('/configurations/:id',function(req,res,next){
    var ids = [req.params.id]
    ConfigurationController.GetConfiguration(ids)
    .on('data',function(data){
      res.status = 200;
      res.returnData ={configuration:data}
      next();
    })
  });

  app.get('/configurations',function(req,res){
    ConfigurationController.GetConfiguration(req.query.ids)
    .on('data',function(data){
      res.status = 200;
      res.returnData ={configuration:data}
      next();
    })
  });

  app.post('/configurations',function(req,res,next){
    console.log('CONFIGINGINGINGIGNGNINING')
    var config = req.body.configuration;
    var f = config.for;
    var target = config.configures;
    delete  config.for;
    delete config.configures;
    console.log('CONFIGINGINGINGIGNGNINING')
    ConfigurationController.CreateCardConfiguartion(target,f,config)
    .on('data',function(data){

    })
  });


  app.put('/configurations/:id',function(req,res,next){

  });
};