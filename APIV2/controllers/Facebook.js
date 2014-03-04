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
      var cc = this;
      var CreateUser = this.CreateUser;
      var CreateSession =this.CreateSession;
      var CreateOAuthAccount = this.CreateOAuthAccount;
      console.log('áaaaaaaaaaaaaaaa')
      console.log(this);
      var user = this.FBUserToDBUser(body);
      var resultStream = this.GetUser(user);
      var account = this.GetLinkedAccountNodeData(body, accessToken);
      resultStream.on('data', function (results) {
        if(results === null){
          resultStream = CreateUser.call(cc,user);
          resultStream.on('data',function(dbUser){
            resultStream = CreateOAuthAccount.call(cc,'Facebook',account,dbUser.id);
            //link Account
            resultStream.on('data',function(results){
              resultStream = CreateSession.call(cc,dbUser);
              resultStream.on('data',function(results){
                done(null, results.data, 'info');
              });
            });
          });
        }else{

          if(!results.data.session_token){
            console.log(results);
            resultStream = CreateSession.call(cc,results);
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