//require staements
var Stream = require('stream');
var fbgraph = require('fbgraph');
var AccountRouteBase = require('./AccountRouteBase.js')

module.exports = function(settings){
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function FacebookRoute(){
  }

  FacebookRoute.prototype = new AccountRouteBase(settings);

  FacebookRoute.prototype.OnAccessToken = function(accessToken, refreshToken, profile, done){
    fbgraph.setAccessToken(accessToken);
    fbgraph.setContext(this);

    fbgraph.get("/me", function (error, body) {
      if (error){
        done(error)
      }

      var CreateUser = this.CreateUser;
      var CreateSession =this.CreateSession;
      var CreateOAuthAccount = this.CreateOAuthAccount;

      var user = this.FBUserToDBUser(body);
      console.log(body);
      console.log(user);
      var resultStream = this.GetUser(user);
      var account = this.GetLinkedAccountNodeData(body, accessToken);
      console.log(account)
      resultStream.on('data', function (results) {
        console.log(results)
        if(results == null){
          console.log('creating user')
          resultStream = CreateUser(user)
          resultStream.on('data',function(dbUser){
            console.log('user created')
            resultStream = CreateOAuthAccount('Facebook',account,dbUser.id)
            //link Account
            resultStream.on('data',function(results){
              resultStream = CreateSession(dbUser)
              resultStream.on('data',function(results){
                done(null, results.data, 'info');
              })
            })
          });
        }else{

          if(!results.data.session_token){
            console.log(results);
            resultStream = CreateSession(results)
            resultStream.on('data',function(results){
              done(null, results.data, 'info');
            })
          }else{
            done(null, results.data, 'info');
          }
        }
      });
    });
  }
  /* ========================================================================================================
   *
   * Helper Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

  FacebookRoute.prototype.FBUserToDBUser = function (body) {
    return user = {
      email: body.email,
      name: body.name,
      first_name: body.first_name,
      last_name: body.last_name,
      gender: body.gender,
      locale: body.locale,

    }
  }

  FacebookRoute.prototype.GetLinkedAccountNodeData = function(body,accessToken){
    return {
      fb_username: body.username,
      fb_uid : body.id,
      fb_access_token: accessToken
    };
  }


  return new FacebookRoute();
}

