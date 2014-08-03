//require staements
var Stream = require('stream');
var fbgraph = require('fbgraph');
var AccountRouteBase = require('./AccountController.js');
module.exports = function() {
  'use strict';
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function FacebookController() {
    this.accountType = 'Facebook';
  }

  FacebookController.prototype = new AccountRouteBase();

  /* ========================================================================================================
   *
   * Helper Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

  FacebookController.prototype.GetOAuthUser = function(accessToken, refreshToken, params) {
    var returnStream = new Stream();
    fbgraph.setAccessToken(accessToken);
    (function(context) {
      fbgraph.get('/me', function(error, body) {
        if (error) {
          done(error);
        }
        var user = context.FBUserToDBUser(body);
        var account = context.GetLinkedAccountNodeData(body, accessToken, params);
        returnStream.emit('data', {
          user: user,
          account: account
        });
      });
    })(this)
    return returnStream;
  }

  FacebookController.prototype.FBUserToDBUser = function(body) {
    var gravatar = this.GetGravatarImage(body.email);
    return {
      email: body.email,
      name: body.name,
      first_name: body.first_name,
      last_name: body.last_name,
      gender: body.gender,
      locale: body.locale,
      profileImg: gravatar
    };
  };

  FacebookController.prototype.GetLinkedAccountNodeData = function(body, accessToken, params) {
    return {
      username: body.username,
      uid: body.id,
      access_token: accessToken,
      expires_in: params.expires
    };
  };


  return new FacebookController();
};
