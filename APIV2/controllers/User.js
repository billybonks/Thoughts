
//require staements
var controller = require('./controller.js');

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


  User.prototype.GetUser=function (id){
    var query = 'start user=node('+id+') return user';
    return this.executeQuery(query,{});

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
