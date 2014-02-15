var neo4j = require('neo4j-js');
var Stream = require('stream');

exports.variables = {
  facebook_authorization_url: 'https://www.facebook.com/dialog/oauth',
  facebook_token_url: 'https://graph.facebook.com/oauth/access_token',
  facebook_client_id: '171284626406184',
  facebook_client_secret: 'd6265fa2fd27376c2d939ecc9fe64c04',
  facebook_callback_url: 'http://localhost:4730/auth/facebook/callback',
  google_authorization_url: 'asd',
  google_token_url: 'asd',
  google_client_id: 'asd',
  google_client_secret: 'asd',
  google_callback_url: 'asd',
  domain:'localhost'
}

exports.DBConnect = function(callback){
  neo4j.connect('http://localhost:7474/db/data/',callback);
}

exports.executeQuery = function(query,variableHash){
  var queryStream = new Stream();
  neo4j.connect('http://localhost:7474/db/data/',function (err, graph, done) {
      //console.log(query);
      var data = variableHash;
    graph.query(query,data, function (err, results) {
        if(err){
          console.log(err);
          throw err;
        }
        else
          queryStream.emit('data',results)
      });
  });
  return queryStream;
}
//var batch = graph.createBatch();
exports.executeBatchQuery = function(batch,variableHash){
  var queryStream = new Stream();
  neo4j.connect('http://localhost:7474/db/data/',function (err, graph, done) {
    //console.log(variableHash);
      //console.log(query);
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