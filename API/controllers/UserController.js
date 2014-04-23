var controller = require('./Controller.js');
var Stream = require('stream');
var ErrorHandler = require('./../lib/Errors.js');

module.exports = function(){
  'use strict';
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function User(){
  }

  User.prototype = new controller();

  /* ========================================================================================================
   *
   * Read Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

  User.prototype.GetUser=function (token){
    var query = 'Match (user:Person) where user.session_token = {token} return user';
    return this.executeQuery(query,{token:token});
  };

  User.prototype.GetFullUser=function(token){
    var resultStream = new Stream();
    var context = this;
    var query = ['Match (user:Person)',
                 'Match (user)-[:Linked]->(account)',
                 ' where user.session_token = {token}',
                 ' return user,account,Labels(account)'];
    this.executeQuery(query.join('\n'),{token:token}).on('data',function(results){
      var accounts = {}
      var user = context.FormatObject(results[0].user);
      for(var i = 0; i<results.length;i++){
        accounts[results[i]['Labels(account)']] = context.FormatAccount(results[i].account);
      }

      user.accounts = accounts;
      resultStream.emit('data',user);
    });
    return resultStream;
  }

  User.prototype.GetUserById=function (id){
    var query = 'start user=node('+id+') return user';
    return this.executeQuery(query,{});
  };

  User.prototype.CreatedEntity = function(token,id){
    var cardPersonRelationShip =  [
      'START entity=node('+id+')',
      'MATCH (user:Person)',
      'WHERE user.session_token = {token}',
      'CREATE user-[r:Created]->entity',
      'RETURN user,entity'
    ];
    var cardRelHash = {token:token};
    var responseStream = new Stream();
    var relStream = this.executeQuery(cardPersonRelationShip.join('\n'),cardRelHash);
    relStream.on('data', function (results) {
      responseStream.emit('data',results[0]);
    });
    return responseStream;
  };

  User.prototype.FormatObject=function(object){
    return  {
      id: object.id,
      name: object.data.name,
      email: object.data.email
    };
  };

  User.prototype.FormatAccount=function(object){
    return  {
      uid: object.data.uid,
      access_token: object.data.access_token,
      username: object.data.username,
      refresh_token :object.data.refresh_token,
      date_modified :object.data.date_modified,
      expires_in :object.data.expires_in,
      date_created :object.data.date_created
    };
  };

  /* ========================================================================================================
   *
   * Write Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  return new User();
};
