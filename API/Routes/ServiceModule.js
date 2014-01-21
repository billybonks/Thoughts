//require staements
var Stream = require('stream');
module.exports = function(settings){
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function ServiceModule(){
    this.responseStream = new Stream();
  }
  /* ========================================================================================================
   *
   * Helper Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
 /* ServiceModule.prototype.once=function(event,callback){
    console.log('registering '+event);
    this.responseStream.once(event,callback);
  }

  ServiceModule.prototype.on=function(event,callback){
    console.log('registering '+event);
    this.responseStream.on(event,callback);
  }

  ServiceModule.prototype.emit=function(event,payload){
    console.log('firing '+event);
    this.responseStream.emit(event,payload)
  }*/

  ServiceModule.prototype.GetNodes=function(ids){
    var emitter = new Stream();
    var query = 'START n=node('
    for(var c =0; c <ids.length;c++){
      if(c+1 == ids.length){
        query += ids[c];
      }else{
        query += ids[c]+',';
      }
    }
    query +=  ') return n';
    var queryStream = settings.executeQuery(query,{});
    queryStream.on('data',function(results){
      emitter.emit('GetNodes.done',results);
    });
    return emitter;
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