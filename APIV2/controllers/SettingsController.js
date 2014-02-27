
//require staements
var Controller = require('./controller.js');
var UserController = require('./UserController.js')();
var Stream = require('stream');

module.exports = function(){
  'use strict';
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function SettinsController(){
  }

  SettinsController.prototype = new Controller();

  SettinsController.prototype.GetSettings = function(token){
    var settings = {id:0};
    var resultStream = new Stream()
    var context = this;
    UserController.GetUser(token).on('data',function(user){
      var user = user[0].user;
      settings.name = user.data.name;
      var responseStream=context.GetUserLinkedAccounts.call(context,user.id);
      responseStream.on('data',function(accounts){
        console.log(accounts);
        for(var i = 0; i < accounts.length; i++){
          var label = accounts[i]['labels(account)'][0];
          console.log(label)
          if(label === 'Facebook'){
            settings.facebook = true;
          }
          if(label === 'Google'){
            settings.facebook = true;
          }
        }
        resultStream.emit('data',settings);
      })
    })
    return resultStream;
  }

  SettinsController.prototype.GetUserLinkedAccounts= function(userId){
    var query = "Start user=node("+userId+") Match user-[l:Linked]->account return labels(account)";
    var responseStream = this.executeQuery(query,{});
    return responseStream;
  }

  return new SettinsController();
};
