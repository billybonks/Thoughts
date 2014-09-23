var controller = require('./Controller.js');
var Stream = require('stream');
var ErrorHandler = require('./../lib/Errors.js');
var rsvp = require('rsvp');
var error = require('./../lib/Errors.js').reject;
var Promise = require('./../lib/promise')
var User = require('./../models/user')();
module.exports = function() {
  'use strict';
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function UserController() {}

  UserController.prototype = new controller();

  /* ========================================================================================================
   *
   * Read Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

  UserController.prototype.GetUser = function(token) {
    return Promise.call(this, function(resolve, reject) {
      var query = 'Match (node:Person) where node.session_token = {token} return node';
      this.executeQueryRSVP(query, {
        token: token
      }).then(function(results){
        if(results.length ===0){
          console.log('t')
          reject({message:'notfound',statusCode:404});
        }
        console.log(new User(results[0].node).id);
        var user = User.parse(results[0].node)
        console.log('resolving')
        resolve(user)
      },error(reject));
    });
  };

  UserController.prototype.GetFullUser = function(token) {
    var context = this;
    return Promise.call(this, function(resolve, reject) {
      var query = ['Match (user:Person)',
        'Match (user)-[:Linked]->(account)',
        ' where user.session_token = {token}',
        ' return user,account,Labels(account)'
      ];
      this.executeQueryRSVP(query.join('\n'), {
        token: token
      }).then(function(results) {
        //TODO:Add to user model
        var accounts = {}
        var user = context.FormatObject(results[0].user);
        for (var i = 0; i < results.length; i++) {
          accounts[results[i]['Labels(account)']] = context.FormatAccount(results[i].account);
        }
        user.accounts = accounts;
        resolve(user);
      },error(reject));
    });
  }

  UserController.prototype.GetUserById = function(id) {
    var query = 'start user=node(' + id + ') return user';
    return this.executeQueryRSVP(query, {});
  };

  UserController.prototype.CreatedEntity = function(token, id) {
    var cardPersonRelationShip = [
      'START entity=node(' + id + ')',
      'MATCH (user:Person)',
      'WHERE user.session_token = {token}',
      'CREATE user-[r:Created]->entity',
      'RETURN user,entity'
    ];
    var cardRelHash = {
      token: token
    };
    var responseStream = new Stream();
    var relStream = this.executeQuery(cardPersonRelationShip.join('\n'), cardRelHash);
    relStream.on('data', function(results) {
      responseStream.emit('data', results[0]);
    });
    return responseStream;
  };

  UserController.prototype.FormatObject = function(object) {
    return {
      id: object.id,
      name: object.data.name,
      email: object.data.email
    };
  };

  UserController.prototype.FormatAccount = function(object) {
    return {
      uid: object.data.uid,
      access_token: object.data.access_token,
      username: object.data.username,
      refresh_token: object.data.refresh_token,
      date_modified: object.data.date_modified,
      expires_in: object.data.expires_in,
      date_created: object.data.date_created
    };
  };

  /* ========================================================================================================
   *
   * Write Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  return new UserController();
};
