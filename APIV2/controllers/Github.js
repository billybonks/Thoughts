//require staements
var Stream = require('stream');
var fbgraph = require('fbgraph');
var GitHubApi = require("github");

var AccountRouteBase = require('./AccountController.js');
module.exports = function(){
  'use strict';
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function GithubController(){
  }

  GithubController.prototype = new AccountRouteBase();

  /* ========================================================================================================
   *
   * Helper Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

  GithubController.prototype.GetOAuthUser = function(accessToken) {
    var returnStream = new Stream();
    var github = new GitHubApi({
      // required
      version: "3.0.0",
      // optional
      timeout: 5000
    });
    var context = this;
    github.authenticate({
      type: "oauth",
      token: accessToken
    });
    github.user.get({}, function(err, res) {
      var user = context.OAuthUserToDBUser(res);
      var account = context.GetLinkedAccountNodeData(res, accessToken);
      console.log(user);
      console.log(account);
      returnStream.emit('data',{user:user,account:account});
    });
    return returnStream;
  }

  GithubController.prototype.OAuthUserToDBUser = function (body) {
    var gravatar =this.GetGravatarImage(body.email);
    var nameArr = body.name.split(' ')
    var firstName = nameArr[0];
    var lastName
    if(nameArr.length >1){
      lastName = nameArr[nameArr.length-1];
    }
    return  {
      email: body.email,
      name: body.name,
      first_name: firstName,
      last_name: lastName,
      location: body.locale,
      profileImg : gravatar
    };
  };

  GithubController.prototype.GetLinkedAccountNodeData = function(body,accessToken){
    return {
      username: body.login,
      uid : body.id,
      access_token: accessToken
    };
  };


  return new GithubController();
};
