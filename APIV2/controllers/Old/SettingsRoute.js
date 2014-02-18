var Stream = require('stream');
var UserRoute = require('./UserRoute.js')
var ServiceModule = require('./ServiceModule.js');

module.exports = function(settings){

  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function SettingsRoute(settings){
    this.users = new UserRoute(settings);
  }


  SettingsRoute.prototype = new ServiceModule(settings);

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
    var responseStream = settings.executeQuery(query,{});
    return responseStream;
  }

  return new SettingsRoute(settings)
}