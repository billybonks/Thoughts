var controller = require('./Controller.js');
var error = require('./../lib/Errors.js').reject;
var Promise = require('./../lib/promise')
var Model = require('./../models/user')();
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
     //application
    UserController.prototype.GetUser = function(token) {
        return Promise.call(this, function(resolve, reject) {
          if(token){
            var query = 'Match (node:Person) where node.session_token = {token} return node';
            this.executeQueryRSVP(query, {
                token: token
            }).then(function(results) {
                console.log('Got UUU')
                if (results.length === 0) {
                    console.log('t')
                    reject({
                        message: 'notfound',
                        statusCode: 404
                    });
                }
                var user = new Model();
                user.parse(results[0])
                resolve(user)
            }, error(reject));
          }else{
            reject({
                message: 'notfound',
                statusCode: 404
            })
          }

        });
    };
    //attachment
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
                if (results.length === 0) {
                    reject({
                        message: 'notfound',
                        statusCode: 404
                    });
                }
                var accounts = {}
                var user = context.FormatObject(results[0].user);
                for (var i = 0; i < results.length; i++) {
                    accounts[results[i]['Labels(account)']] = context.FormatAccount(results[i].account);
                }
                user.accounts = accounts;
                resolve(user);
            }, error(reject));
        });
    }

    UserController.prototype.GetUserById = function(id) {
        var query = 'start user=node(' + id + ') return user';
        return this.executeQueryRSVP(query, {});
    };
    //FIXME:this needs to be removed
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
        return Promise.call(this, function(resolve, reject) {
            this.executeQueryRSVP(cardPersonRelationShip.join('\n'), cardRelHash).then(function(results) {
                resolve(results[0]);
            },error(reject));
        });
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
