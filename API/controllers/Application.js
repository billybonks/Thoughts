
//require staements
var controller = require('./Controller.js');
var ErrorHandler = require('./../lib/Errors.js');
var Stream = require('stream');
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
    var responseStream = new Stream();
    var sessionToken = {token:token};
    var query = 'START n=node(*) WHERE has (n.session_token) and n.session_token={token} RETURN n';
    this.executeQuery(query,sessionToken).on('data',function(data){
      responseStream.emit('data',data);
    }).on('error',function(error){
      ErrorHandler.Handle500(responseStream,'GetApplication',error);
    })
    return responseStream;
  };

  /*

  */

  Application.prototype.FormatObject=function(application){
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