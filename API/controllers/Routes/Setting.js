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
    UserController.GetUser(req.headers['authorization']).then(function(user) {
      console.log(  SettingsController.GetSettings)
      SettingsController.GetSettings(user).then(function(settings) {
        res.status = 200;
        res.returnData = {
          settings: settings
        }
        next();
      },ErrorHandler.FowardErrorToBrowser(res, next));
    },ErrorHandler.FowardErrorToBrowser(res, next));
  });

};
