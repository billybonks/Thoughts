var SettingsController = require('./../SettingsController')();
var ErrorHandler = require('./../../lib/Errors.js');
var UserController = require('./../UserController.js')();
module.exports = function(app) {
  'use strict';
  /* ========================================================================================================
   *
   * Settings Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  app.get('/settings/:id', function(req, res, next) {
      console.log(  SettingsController.GetSettings)
      SettingsController.GetSettings(req.user).then(function(settings) {
        res.status = 200;
        res.returnData = {
          settings: settings
        }
        next();
      },ErrorHandler.FowardErrorToBrowser(res, next));
  });

};
