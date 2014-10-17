var SettingsController = require('./../SettingsController');
var controller = new SettingsController();
var ErrorHandler = require('./../../lib/Errors.js');
module.exports = function(app) {
  'use strict';
  /* ========================================================================================================
   *
   * Settings Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  app.get('/settings/:id', function(req, res, next) {
      controller.GetSettings(req.user).then(function(settings) {
        res.status = 200;
        res.returnData = {
          settings: settings
        }
        next();
      },ErrorHandler.error(res, next));
  });

};
