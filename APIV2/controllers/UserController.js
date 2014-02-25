
//require staements
var controller = require('./controller.js');
var Stream = require('stream');
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


  /* ========================================================================================================
   *
   * Write Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  return new User();
};
