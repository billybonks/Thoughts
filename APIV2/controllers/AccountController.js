//require staements
var Stream = require('stream');
var crypto = require('crypto');
var controller = require('./controller.js');
var db = require('./../lib/Database')
module.exports = function(){
  'use strict';
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function AccountRouteBase(){
    this.responseStream = new Stream();
  }
  AccountRouteBase.prototype = new controller();

  /* ========================================================================================================
   *
   * Write Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  AccountRouteBase.prototype.CreateSession =function (userRec) {
    var resultStream = new Stream();
    var md5sum = crypto.createHash('md5');
    var user = userRec.data;
    console.log(userRec.id);
    if(!user.session_token){
      md5sum.update(userRec.id);
      var session = md5sum.digest('hex');
      var query = 'START n=node('+userRec.id+') SET n.session_token = {session} RETURN n';
      var variableHash = {session:session};
           console.log('wwwwwwwwwwwwwww');
    console.log(this);
      var queryStream = this.executeQuery(query,variableHash);
      queryStream.on('data', function (results) {
        resultStream.emit('data', results[0].n);
      });
    }else{
      resultStream.emit('data', user);
    }
    return resultStream;
  };

  AccountRouteBase.prototype.CreateUser = function(user){
    console.log(user);
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
    var query = 'START n=node(*) WHERE has (n.email) and n.email={email} RETURN n';
    var resultStream = new Stream();
    var variableHash = { email: user.email };
    var queryStream = this.executeQuery(query,variableHash);
    queryStream.on('data', function (results) {
      if (results.length === 0) {
        resultStream.emit('data',null);
      }else{
        resultStream.emit('data',results[0].n);
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