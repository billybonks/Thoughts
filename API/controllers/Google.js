//require staements
var Stream = require('stream');
var request = require('request');
var OauthVars = require('./Routes/secrets')
var refresh = require('google-refresh-token');

var AccountRouteBase = require('./AccountController.js');
module.exports = function(){
  'use strict';
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function GoogleController(){
    this.accountType ='Google';
  }

  GoogleController.prototype = new AccountRouteBase();

  /* ========================================================================================================
   *
   * Helper Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

  GoogleController.prototype.GetOAuthUser = function(accessToken,refreshToken,params) {
    var returnStream = new Stream();
    var context = this;
    var authValue = 'Bearer '+accessToken;
    var options = {
      url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
      headers: {
        Authorization:authValue
      }
    };

    request(options,function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        var user = context.OAuthUserToDBUser(info);
        var account = context.GetLinkedAccountNodeData(info, accessToken,refreshToken,params);
        console.log(user);
        console.log(account);
        returnStream.emit('data',{user:user,account:account});
      }
    });
    return returnStream;
  }

  /**
  { id: '114434019297077638300',
  email: 'sebastienstettler@gmail.com',
  verified_email: true,
  name: 'sebastien stettler',
  given_name: 'sebastien',
  family_name: 'stettler',
  link: 'https://plus.google.com/+sebastienstettler',
  picture: 'https://lh6.googleusercontent.com/-aXpiYkHiSq0/AAAAAAAAAAI/AAAAAAAAA
lE/KJBivNDSv4s/photo.jpg',
  gender: 'male',
  locale: 'en' }
  **/

  GoogleController.prototype.OAuthUserToDBUser = function (body) {
    return  {
      email: body.email,
      name: body.name,
      first_name: body.given_name,
      last_name: body.family_name,
      location: body.locale,
      profileImg : body.picture
    };
  };

  GoogleController.prototype.GetLinkedAccountNodeData = function(body,accessToken,refreshToken,params){
    return {
      username: body.email,
      uid : body.id,
      access_token: accessToken,
      refresh_token:refreshToken,
      expires_in:params.expires_in
    };
  };

  GoogleController.prototype.GetAccessToken = function(refreshToken){
    var responseStream = new Stream();
    refresh(refreshToken, OauthVars.google.client_id, OauthVars.google.client_secret, function (err, json, res) {
      console.log(json)
      if (err) console.log(err)
      if (json.error) console.log(json.error)

      var newAccessToken = json.accessToken;
      if (! newAccessToken) {
        console.log('no access token')
      }
      if(newAccessToken){
        console.log('returning')
        responseStream.emit('data',{access_token:newAccessToken,expires_in:json.expiresIn})
      }
    });
    return responseStream;
  };

  return new GoogleController();
};
