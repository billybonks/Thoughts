//require staements
var controller = require('./Controller.js');
var error = require('./../lib/Errors.js').reject;
var rsvp = require('rsvp');
module.exports = function() {
  'use strict';
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function Application() {}

  Application.prototype = new controller();

  /* ========================================================================================================
   *
   * Read Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  Application.prototype.GetApplication = function(token) {
    var context = this;
    return new rsvp.Promise(function(resolve, reject) {
      var sessionToken = {
        token: token
      };
      var query = 'START n=node(*) WHERE has (n.session_token) and n.session_token={token} RETURN n';
      context.executeQueryRSVP(query, sessionToken).then(function(data) {
        resolve(data);
      }, error(reject));
    });
  };

  /*

  */

  Application.prototype.FormatObject = function(application) {
    var data = application.data;
    return {
      id: data.session_token,
      token: data.session_token,
      name: data.first_name
    };
  };
  /* ========================================================================================================
   *
   * Write Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  return new Application();
};
