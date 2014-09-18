var Controller = require('./Controller.js');
var UserController = require('./UserController.js')();
var Stream = require('stream');
var ErrorHandler = require('./../lib/Errors.js');
var error = require('./../lib/Errors.js').reject;
var Promise = require('./../lib/promise')

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

      var user = user[0].user;
      settings.name = user.data.name;
      var responseStream=context.GetUserLinkedAccounts.call(context,user.id);
      responseStream.on('data',function(accounts){
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
    
    return resultStream;
  }

  SettinsController.prototype.GetUserLinkedAccounts= function(userId){
    var responseStream = new Stream();
    var query = "Start user=node("+userId+") Match user-[l:Linked]->account return labels(account)";
    ErrorHandler.HandleResponse(this.executeQuery(query,{}),responseStream,'GetUserLinkedAccounts');
    return responseStream;
  }

  return new SettinsController();
};
