
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

  SettinsController.prototype = new controller();

    SettingsRoute.prototype.GetSettings = function(token){
    var settings = {id:0};
    var resultStream = new Stream()
    var GetUserLinkedAccounts = this.GetUserLinkedAccounts
    this.users.GetUser(token).on('data',function(user){
      console.log(user)
      settings.name = user.name;
      var responseStream=GetUserLinkedAccounts(user.id);
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

  SettingsRoute.prototype.GetUserLinkedAccounts= function(userId){
    var query = "Start user=node("+userId+") Match user-[l:Linked]->account return labels(account)";
    var responseStream = this.executeQuery(query,{});
    return responseStream;
  }

  return new SettinsController();
};
