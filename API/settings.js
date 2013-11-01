var neo4j = require('neo4j-js');
var Stream = require('stream');

exports.variables = {
  a: 10,
  SOME_FILE: '/tmp/foo'
}

exports.DBConnect = function(callback){
  neo4j.connect('http://localhost:7474/db/data/',callback);
}

exports.executeQuery = function(query,variableHash){
  var queryStream = new Stream();
  neo4j.connect('http://localhost:7474/db/data/',function (err, graph, done) {
    console.log(variableHash);
      console.log(query);
      var data = variableHash;
    graph.query(query,variableHash, function (err, results) {
        if(err)
          throw err;
        else
          queryStream.emit('data',results)
      });
  });
  return queryStream;
}