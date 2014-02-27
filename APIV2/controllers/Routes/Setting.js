var SettingsController = require('./../SettingsController')
module.exports = function (app) {
  'use strict';
  /* ========================================================================================================
   *
   * Settings Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  app.get('/settings/:id',function(req,res){
    SettingsRoute.GetSettings(req.headers['authorization']).on('data',function(settings){
      console.log('about to respond')
      res.json({settings:settings})
      console.log('responded')
    })
  });

};