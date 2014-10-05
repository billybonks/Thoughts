var Controller = require('./controller.js');
var error = require('./../lib/Errors.js').reject;
var Promise = require('./../lib/promise')
var Model = require('./../models/user');
var Account = require('./../models/model');

module.exports = Controller.extend({
    //FIXME:reject is written in two places
    GetUser: function(token) {
        var context = this;
        return Promise.call(this, function(resolve, reject) {
            var query = ['Match (node:Person)',
                'Match (node)-[:Linked]->(account)',
                ' where node.session_token = {token}',
                ' return node,account,Labels(account)'
            ];
            if (!token) {
                reject({
                    message: 'notfound',
                    statusCode: 404
                });
            }
            this.executeQuery(query.join('\n'), {
                token: token
            }).then(function(results) {
                if (results.length === 0) {
                    reject({
                        message: 'notfound',
                        statusCode: 404
                    });
                }
                var accounts = {}
                var user = new Model();
                user.parse(results[0]);
                for (var i = 0; i < results.length; i++) {
                    var account = new Account();
                    var data = account.flatten(results[i].account)
                    account.update(data)
                    accounts[results[i]['Labels(account)'][0]] = account;
                }
                user.accounts = accounts;
                resolve(user);
            }, error(reject));
        });
    },
    getUserByEmail: function(email) {
        var query = 'START node=node(*) WHERE has (node.email) and node.email={email} Match (node)-[:Linked]->(account) RETURN node,account,Labels(account)';
        return Promise.call(this, function(resolve, reject) {
            var variableHash = {
                email: email
            };
            this.executeQuery(query, variableHash).then(function(results) {
                if (results.length === 0) {
                    reject({
                        message: 'notfound',
                        statusCode: 404
                    });
                } else {
                    var user = new Model();
                    user.parse(results[0]);
                    var accounts = {}
                    //FIXME:this for loop needs to be moved to user model
                    for (var i = 0; i < results.length; i++) {
                        var account = new Account();
                        var data = account.flatten(results[i].account)
                        account.update(data)
                        accounts[results[i]['Labels(account)'][0]] = account;
                    }
                    user.accounts = accounts;
                    resolve(user);
                }
            },error(reject));
        });
    },
    getUserById: function(id) {
        return Promise.call(this, function(resolve, reject) {
            var query = 'start node=node(' + id + ') return node';
            this.executeQuery(query, {}).then(function(results) {
                var user = new Model();
                user.parse(results[0]);
                resolve(user);
            }, error(reject));
        });
    },
    CreateUser : function(user) {
        return Promise.call(this, function(resolve, reject) {
            var newUser = 'CREATE (node:Person {data}) RETURN n';
            var newUserHash = {
                data: user
            };
            this.createNode(user, 'Person').then(function(results) {
              var user = new Model();
              user.parse(results[0]);
              resolve(user);
            });
        });
    }
})
/*
module.exports = function() {
    'use strict';
    /* ========================================================================================================
     *
     * Class Setup - Keep in alphabetical order
     *
     * =====================================================================================================
    function UserController() {}

    UserController.prototype = new controller();

    /* ========================================================================================================
     *
     * Read Methods - Keep in alphabetical order
     *
     * =====================================================================================================
    UserController.prototype.GetUser =

    UserController.prototype.GetUserById =

    /* ========================================================================================================
     *
     * Write Methods - Keep in alphabetical order
     *
     * =====================================================================================================
    return new UserController();
};
*/
