//require staements
var Stream = require('stream');
var fbgraph = require('fbgraph');
var GitHubApi = require("github");
var request = require('request');

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

  GoogleController.prototype.GetOAuthUser = function(accessToken) {
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
        var account = context.GetLinkedAccountNodeData(info, accessToken);
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

  GoogleController.prototype.GetLinkedAccountNodeData = function(body,accessToken){
    return {
      username: body.email,
      uid : body.id,
      access_token: accessToken
    };
  };


  return new GoogleController();
};
