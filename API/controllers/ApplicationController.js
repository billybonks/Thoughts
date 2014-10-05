'use strict';
var Controller = require('./controller.js');
var error = require('./../lib/Errors.js').reject;
var Promise = require('./../lib/promise');
var model = require('./../models/application');
module.exports = Controller.extend({
  getApplication:function(user) {
      return Promise.call(this, function(resolve, reject) {
          if (user) {
              var application = new model();
              application.update({
                  id: user.get('session_token'),
                  name: user.get('first_name'),
                  token: user.get('session_token')
              })
              resolve(application);
          } else {
              resolve(null);
          }
      });
  }
});
