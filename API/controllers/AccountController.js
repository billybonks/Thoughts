'use strict';
var crypto = require('crypto');
var error = require('./../lib/Errors.js').reject;
var Promise = require('./../lib/promise');
var UserController = require('./UserController.js');
var Controller = require('./controller.js');

module.exports = Controller.extend({
    userController: new UserController(),
    RefreshAccessToken: function(refreshToken, userId) {
        return Promise.call(this, function(resolve, reject) {
            var context = this;
            this.GetAccessToken(refreshToken).then(function(result) {
                context.ReplaceAccessToken(context.accountType, userId, result.access_token, result.expires_in).then(function(results) {
                    resolve(results[0].account.data.access_token);
                });
            });
        });
    },
    //FIXME:some sort of error handling here
    //FIXME:Merge this get user with user controller get user
    OnAccessToken: function(accessToken, refreshToken, params, profile, done) {
        var context = this;
        this.GetOAuthUser(accessToken, refreshToken, params).then(function(results) {
            var OAuthuser = results.user;
            var accountNode = results.account;
            accountNode.date_created = Date.now();
            accountNode.date_modified = Date.now();
            context.userController.getUserByEmail(results.user.email).then(function(user) {
                //if user exists but new oauth account
                if (!user.accounts[context.accountType]) {
                    context.CreateOAuthAccount.call(context, context.accountType, accountNode, user.get('id')).then(function(data) {
                        if (!user.get('session_token')) {
                            context.CreateSession.call(context, user).then(function(results) {
                                done(null, results.data, 'info');
                            }, error(reject));
                        } else {
                            done(null, user.data, 'info');
                        }
                    })
                } else {
                    //if user exists and oauthaccount exists
                    context.ReplaceAccessToken.call(context, context.accountType, user.get('id'), accessToken, accountNode.expires_in).then(function(data) {
                        if (!user.get('session_token')) {
                            context.CreateSession.call(context, user).then(function(results) {
                                done(null, results.data, 'info');
                            }, error(reject));
                        } else {
                            done(null, user.data, 'info');
                        }
                    }, function(error){
                      var ass ='asd'
                    });
                }
            }, function(error) {
                //user doesnt exist
                if (error.statusCode === 404) {
                    context.userController.CreateUser.call(context, OAuthuser).then(function(user) {
                        context.CreateOAuthAccount.call(context, context.accountType, accountNode, user.get('id')).then(function(results) {
                            context.CreateSession.call(context, user).then(function(results) {
                                done(null, results.data, 'info');
                            });
                        });
                    });
                } else {

                }

            })
        });
    },
    CreateSession: function(user) {
        return Promise.call(this, function(resolve, reject) {
            var md5sum = crypto.createHash('md5');
            if (!user.get('session_token')) {
                md5sum.update(user.get('id'));
                var session = md5sum.digest('hex');
                var query = 'START n=node(' + user.get('id') + ') SET n.session_token = {session} RETURN n';
                var variableHash = {
                    session: session
                };
                this.executeQuery(query, variableHash).then(function(results) {
                    resolve(results[0].n)
                });
            } else {
                resolve(user)
            }
        });
    },
    ReplaceAccessToken: function(accountLabel, userId, token, expiresIn) {
        var query = ['Start user=node(' + userId + ')',
            'Match user-[:Linked]->(account:' + accountLabel + ')',
            'Set account.access_token = {access_token},',
            'account.date_modified = {date_modified},',
            'account.expires_in = {expires_in}',
            'return account'
        ]
        var variableHash = {
            access_token: token,
            expires_in: expiresIn,
            date_modified: Date.now()
        };
        return this.executeQuery(query.join('\n'), variableHash);
    },
    CreateOAuthAccount: function(accountLabel, accountData, userId) {
        var context = this;
        return Promise.call(this, function(resolve, reject) {
            var newUser = 'CREATE (n:' + accountLabel + ' {data}) RETURN n';
            var newUserHash = {
                data: accountData
            };
            this.executeQuery(newUser, newUserHash).then(function(account) {
                var accountId = account[0].n.id;
                var query = [
                    'START account=node(' + accountId + '),user=node(' + userId + ')',
                    'CREATE user-[r:Linked]->account',
                    'RETURN account'
                ];
                context.executeQuery(query.join('\n'), {}).then(function(results) {
                    resolve(null);
                });
            });
        });
    },
    GetGravatar: function(email) {
        var md5sum = crypto.createHash('md5');
    },
    GetGravatarImage: function(email) {
        var md5sum = crypto.createHash('md5');
        md5sum.update(email.trim().toLowerCase());
        var gravatarID = md5sum.digest('hex');
        return 'http://www.gravatar.com/avatar/' + gravatarID;
    }
});
