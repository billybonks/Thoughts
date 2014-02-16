
//require staements
var controller = require('./controller.js');

module.exports = function(){
	'use strict';
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function Application(){
  }

  Application.prototype = new controller();

  /* ========================================================================================================
   *
   * Read Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  Application.prototype.GetApplication=function (token){
    var sessionToken = {token:token};
    var query = 'START n=node(*) WHERE has (n.session_token) and n.session_token={token} RETURN n';//'START n=node:nodes(session_token = {token}) RETURN n';
    console.log(this.varia);
    return this.executeQuery(query,sessionToken);
  };

  /*

  */

  Application.prototype.FormatApplicationObject=function(application){
    var data = application.data;
    return{id:data.session_token,token:data.session_token,name:data.first_name};
  };
  /* ========================================================================================================
   *
   * Write Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  return new Application();
};