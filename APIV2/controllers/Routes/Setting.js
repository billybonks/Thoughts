var SettingsController = require('./../SettingsController')();
module.exports = function (app) {
  'use strict';
  /* ========================================================================================================
   *
   * Settings Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  app.get('/settings/:id',function(req,res,next){
    SettingsController.GetSettings(req.headers['authorization']).on('data',function(settings){
      res.status = 200;
      res.returnData ={settings:settings}
      next();
    })
  });

};