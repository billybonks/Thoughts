'use strict';

module.exports = function () {

  var executequery = function(query,variableHash){
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
  return executequery;
};
