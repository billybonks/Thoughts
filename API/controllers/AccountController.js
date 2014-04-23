var Stream = require('stream');
var crypto = require('crypto');
var controller = require('./Controller.js');
var db = require('./../lib/Database')
var ErrorHandler = require('./../lib/Errors.js');

module.exports = function(){
  'use strict';
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function AccountRouteBase(){
    this.responseStream = new Stream();
    this.word ='fart'
  }

  AccountRouteBase.prototype = new controller();

  AccountRouteBase.prototype.RefreshAccessToken= function(refreshToken,userId){
    var responseStream = new Stream();
    var context = this;
    /*
        var access_token = user.accounts.Google.access_token;
    var expiry = user.accounts.Google.expires_in;
    var dateModified = user.accounts.Google.date_modified;
    if((dateModified +expiry)>Date.now()){

    }
    */
    this.GetAccessToken(refreshToken).on('data',function(result){
      context.ReplaceAccessToken(context.accountType,userId,result.access_token,result.expires_in).on('data',function(results){
        responseStream.emit('data',results[0].account.data.access_token);
      });
    });
    return responseStream;
  }


  AccountRouteBase.prototype.OnAccessToken = function(accessToken, refreshToken,params, profile, done){
    var context = this;
    var GetUser = this.GetUser;

    this.GetOAuthUser(accessToken,refreshToken,params).on('data',function(results){
      var OAuthuser = results.user;
      var accountNode = results.account;
      accountNode.date_created = Date.now();
      accountNode.date_modified = Date.now();
      context.GetUser.call(context,OAuthuser)
      .on('data',function(results){
        var user;
        if(results !== null){
          user = results.user;
          var accounts = results.accounts;
          var accountExists = false;
          for(var i =0;i<accounts.length;i++){
            if(context.accountType === accounts[i]){
              accountExists = true;
              break;
            }
          }
        }
        if(results === null){
          var createUserStream = context.CreateUser.call(context,OAuthuser)
          .on('data',function(dbUser){
            context.CreateOAuthAccount.call(context,context.accountType,accountNode,dbUser.id)
            .on('data',function(results){
              context.CreateSession.call(context,dbUser)
              .on('data',function(results){
                done(null, results.data, 'info');
              });
            });
          });
        }else if(accountExists===false){
          context.CreateOAuthAccount.call(context,context.accountType,accountNode,user.id)
          .on('data',function(data){
            if(!user.data.session_token){
              context.CreateSession.call(context,user)
              .on('data',function(results){
                done(null, results.data, 'info');
              });
            }else{
              done(null, user.data, 'info');
            }
          })
        }else{
          context.ReplaceAccessToken.call(context,context.accountType,user.id,accessToken,accountNode.expires_in).on('data',function(data){
            if(!user.data.session_token){
              context.CreateSession.call(context,user)
              .on('data',function(results){
                done(null, results.data, 'info');
              });
            }else{
              done(null, user.data, 'info');
            }
          });
        }
      })
    });
  };


  /* ========================================================================================================
   *
   * Write Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  AccountRouteBase.prototype.CreateSession =function (userRec) {
    var resultStream = new Stream();
    var md5sum = crypto.createHash('md5');
    var user = userRec.data;
    if(!user.session_token){
      md5sum.update(userRec.id);
      var session = md5sum.digest('hex');
      var query = 'START n=node('+userRec.id+') SET n.session_token = {session} RETURN n';
      var variableHash = {session:session};
      var queryStream = this.executeQuery(query,variableHash);
      queryStream.on('data', function (results) {
        resultStream.emit('data', results[0].n);
      });
    }else{
      resultStream.emit('data', user.data);
    }
    return resultStream;
  };

  AccountRouteBase.prototype.ReplaceAccessToken=function(accountLabel,userId,token,expiresIn){
    var query = ['Start user=node('+userId+')',
                 'Match user-[:Linked]->(account:'+accountLabel+')',
                 'Set account.access_token = {access_token},',
                 'account.date_modified = {date_modified},',
                 'account.expires_in = {expires_in}',
                 'return account']
    var variableHash = {access_token:token,expires_in:expiresIn,date_modified:Date.now()};
    return this.executeQuery(query.join('\n'),variableHash);
  }

  AccountRouteBase.prototype.CreateUser = function(user){
    var newUser = 'CREATE (n:Person {data}) RETURN n';
    var newUserHash = {data:user};
    var queryStream = this.executeQuery(newUser,newUserHash);
    var resultStream = new Stream();
    queryStream.on('data', function (results) {
      resultStream.emit('data',results[0].n);
    });
    return resultStream;
  };

  AccountRouteBase.prototype.CreateOAuthAccount = function(accountLabel,accountData,userId){
    var newUser = 'CREATE (n:'+accountLabel+' {data}) RETURN n';
    var newUserHash = {data:accountData};
    var queryStream = this.executeQuery(newUser,newUserHash);
    var context = this;
    var returnStream = new Stream();
    queryStream.on('data', function (account) {
      var accountId = account[0].n.id;
      var query =  [
        'START account=node('+accountId+'),user=node('+userId+')',
        'CREATE user-[r:Linked]->account',
        'RETURN account'
      ];
      var queryStream = context.executeQuery(query.join('\n'),{});
      queryStream.on('data',function(results){
        returnStream.emit('data',null);
      });
    });
    return returnStream;
  };



  /* ========================================================================================================
   *
   * Get Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  AccountRouteBase.prototype.GetUser = function (user) {
    var query = 'START n=node(*) WHERE has (n.email) and n.email={email} Match (user)-[:Linked]->(account) RETURN n,Labels(account)';
    var resultStream = new Stream();
    var variableHash = { email: user.email };
    var queryStream = this.executeQuery(query,variableHash);
    queryStream.on('data', function (results) {
      if (results.length === 0) {
        resultStream.emit('data',null);
      }else{
        var user = results[0].n;
        var accounts = []
        for(var i = 0; i<results.length;i++){
          accounts.push(results[i]['Labels(account)'][0]);
        }
        var ret = {user:user,accounts:accounts};
        resultStream.emit('data',ret);
      }
    });
    return resultStream;
  };

  AccountRouteBase.prototype.GetGravatar= function(email){
    var md5sum = crypto.createHash('md5');
  };
  /* ========================================================================================================
   *
   * Helper Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  AccountRouteBase.prototype.GetGravatarImage = function (email) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(email.trim().toLowerCase());
    var gravatarID = md5sum.digest('hex');
    return 'http://www.gravatar.com/avatar/'+gravatarID;
  };

  return new AccountRouteBase();
};