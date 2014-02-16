var Stream = require('stream');
var neo4j = require('neo4j-js');

module.exports = function(){
  'use strict';
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function Controller(){
  }
  /* ========================================================================================================
   *
   * Helper Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  Controller.prototype.GetNodes=function(ids,filters){
    var emitter = new Stream();
    var query = 'START n=node(';
    for(var c =0; c <ids.length;c++){
      if(c+1 == ids.length){
        query += ids[c];
      }else{
        query += ids[c]+',';
      }
    }
    query +=  ') Where not(has(n.isDeleted)) return n';
    var queryStream = this.executeQuery(query,{});
    queryStream.on('data',function(results){
      emitter.emit('GetNodes.done',results);
    });
    return emitter;
  };

  Controller.prototype.DeleteEntity=function(id){
    var responseStream = new Stream();
    var query = ['START n=node('+id+')',
                 'SET n.isDeleted = true',
                 'RETURN n'];
    console.log(query.join('\n'));
    return this.executeQuery(query.join('\n'),{});
  };

  Controller.prototype.executeQuery = function(query,variableHash){
    var queryStream = new Stream();
    neo4j.connect('http://localhost:7474/db/data/',function (err, graph, done) {
      console.log(query);
      console.log(variableHash);
      graph.query(query,variableHash, function (err, results) {

        if(err){
          console.log(err);
          queryStream.emit('error',err);
        }
        else{
          queryStream.emit('data',results);
        }
      });
    });
    return queryStream;
  };

  return new Controller();
};