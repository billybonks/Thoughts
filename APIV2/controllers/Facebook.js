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
  }

  FacebookController.prototype = new AccountRouteBase();

  FacebookController.prototype.OnAccessToken = function(accessToken, refreshToken, profile, done){
    fbgraph.setAccessToken(accessToken);
    fbgraph.setContext(this);

    fbgraph.get('/me', function (error, body) {
      if (error){
        done(error);
      }
      var context = this;
      var CreateUser = this.CreateUser;
      var CreateSession =this.CreateSession;
      var CreateOAuthAccount = this.CreateOAuthAccount;

      var user = this.FBUserToDBUser(body);
      console.log(body);
      console.log(user);
      var resultStream = this.GetUser(user);
      var account = this.GetLinkedAccountNodeData(body, accessToken);
      resultStream.on('data', function (results) {
        if(results === null){
          resultStream = CreateUser.call(context,user);
          resultStream.on('data',function(dbUser){
            resultStream = CreateOAuthAccount.call(context,'Facebook',account,dbUser.id);
            //link Account
            resultStream.on('data',function(results){
              resultStream = CreateSession(dbUser);
              resultStream.on('data',function(results){
                done(null, results.data, 'info');
              });
            });
          });
        }else{

          if(!results.data.session_token){
            console.log(results);
            resultStream = CreateSession.call(context,results);
            resultStream.on('data',function(results){
              done(null, results.data, 'info');
            });
          }else{
            done(null, results.data, 'info');
          }
        }
      });
    });
  };
  /* ========================================================================================================
   *
   * Helper Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

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
