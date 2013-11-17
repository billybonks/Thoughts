//require staements
var Stream = require('stream');
module.exports = function(settings){
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function ServiceModule(){
  }
  /* ========================================================================================================
   *
   * Helper Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  ServiceModule.prototype.proccessRequestVariables=function(req){
    console.log('processing Vars')
    this.id = req.params.id;
    this.token = req.headers['authorization'];
  }

  ServiceModule.prototype.DeleteEntity=function(id){
    var responseStream = new Stream();
    var query = ['START n=node('+id+')',
                 'SET n.isDeleted = true',
                 'RETURN n'];
    console.log(query.join('\n'));
    var queryStream = settings.executeQuery(query.join('\n'),{});
    queryStream.on('data',function(results){
      responseStream.emit('data',results)
      console.log(results);
    })
    return responseStream;
  }

  return new ServiceModule();
}