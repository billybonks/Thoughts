//require staements
var Stream = require('stream');
var fbgraph = require('fbgraph');
var AccountRouteBase = require('./AccountController.js');
module.exports = function(){
  'use strict';
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function FacebookController(){
    this.accountType ='Facebook';
  }

  FacebookController.prototype = new AccountRouteBase();

  /* ========================================================================================================
   *
   * Helper Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

  FacebookController.prototype.GetOAuthUser = function(accessToken) {
    var returnStream = new Stream();
    fbgraph.setAccessToken(accessToken);
    fbgraph.setContext(this);
    fbgraph.get('/me', function (error, body) {
      if (error){
        done(error);
      }
      var user = this.FBUserToDBUser(body);
      var account = this.GetLinkedAccountNodeData(body, accessToken);
      returnStream.emit('data',{user:user,account:account});
    });
    return returnStream;
  }

  FacebookController.prototype.FBUserToDBUser = function (body) {
    var gravatar =this.GetGravatarImage(body.email);
    return  {
      email: body.email,
      name: body.name,
      first_name: body.first_name,
      last_name: body.last_name,
      gender: body.gender,
      locale: body.locale,
      profileImg : gravatar
    };
  };

  FacebookController.prototype.GetLinkedAccountNodeData = function(body,accessToken){
    return {
      fb_username: body.username,
      fb_uid : body.id,
      fb_access_token: accessToken
    };
  };


  return new FacebookController();
};
