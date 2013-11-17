//require staements
var seviceModule = require('./ServiceModule.js')
var Stream = require('stream');

module.exports = function(settings){

  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function Application(){
  }

  Application.prototype = new seviceModule(settings);

  /* ========================================================================================================
   *
   * Read Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  Application.prototype.GetApplication=function (token){
    var sessionToken = {token:token};
    var query = 'START n=node(*) WHERE has (n.session_token) and n.session_token={token} RETURN n';//'START n=node:nodes(session_token = {token}) RETURN n';
    var resultStream= new Stream();
    var queryStream = settings.executeQuery(query,sessionToken);
    queryStream.on('data', function (results) {
      if(results.length > 0){
        var data = results[0].n.data;
        data.id = data.session_token;
        var ret = {id:data.session_token,token:data.session_token,name:data.first_name}
        console.log(ret)
      }else{
        ret = [{id:sessionToken.token}];
      }
      resultStream.emit('data',ret)
    });
    return resultStream;
  }
  /* ========================================================================================================
   *
   * Write Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  return new Application();
}