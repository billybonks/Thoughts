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
      SettingsController.GetSettings(user).on('data', function(settings) {
        res.status = 200;
        res.returnData = {
          settings: settings
        }
        next();
      }).on('error', ErrorHandler.FowardErrorToBrowser(res, next));
    });//TOD:HANDLE ERROR
  });

};
