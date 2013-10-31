var fbgraph = require('fbgraph');
var passport = require('passport');
var neo4j = require('neo4j-js');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var crypto = require('crypto');

var Stream = require('stream');
var userExists = new Stream();
var sessionStream = new Stream();
var md5sum = crypto.createHash('md5');
var settings = require('./../settings.js')

exports.OnAccessToken =
  function (accessToken, refreshToken, profile, done) {
      fbgraph.setAccessToken(accessToken);
      fbgraph.get("/me", function (error, body) {
          if (error)
              done(error)
          var user = FBUserToDBUser(body, accessToken)
          GetUser(user);
          //On Session Stream
          sessionStream.on('data', function (user) {
              done(null, user, 'info');
          });
      })
  }

function FBUserToDBUser(body, accessToken) {
    return user = {
        id: body.id,
        name: body.name,
        first_name: body.first_name,
        last_name: body.last_name,
        username: body.username,
        gender: body.gender,
        locale: body.locale,
        email: body.email,
        access_token: accessToken
    }
}

function GetUser(user) {
    var query = 'START n=node(*) WHERE has (n.id) and n.id={id} RETURN n';
    var variableHash = { id: user.id };
    var queryStream = settings.executeQuery(query,variableHash);
    queryStream.on('data', function (results) {
      if (results.length == 0) {
        settings.DBConnect(function (err, graph, done) {
          var newCard = 'CREATE (n:Person {data}) RETURN n';
          graph.createNode(user, function (err, node) {
            console.log(node);
            CreateSession(node);
          });
        });
      }else{
        console.log('User Found Creating Session');
        CreateSession(results[0].n);
      }
    })
}

function CreateSession(userRec) {
  var user = userRec.data;
  if(!user.session_token){
    md5sum.update(user.access_token);
    var session = md5sum.digest('hex');
    var query = 'START n=node('+userRec.id+') SET n.session_token = {session} RETURN n';
    var variableHash = {session:session};
    var queryStream = settings.executeQuery(query,variableHash);
    queryStream.on('data', function (results) {
      sessionStream.emit('data', results[0].n.data);
    });
  }else{
    sessionStream.emit('data', user);
  }
}