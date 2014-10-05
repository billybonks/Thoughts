//require staements
var Stream = require('stream');
var fbgraph = require('fbgraph');
var AccountController = require('./AccountController.js');
var error = require('./../lib/Errors.js').reject;
var Promise = require('./../lib/promise');

module.exports = AccountController.extend({
    accountType: 'Facebook',
    GetOAuthUser: function(accessToken, refreshToken, params) {
        return Promise.call(this, function(resolve, reject) {
            fbgraph.setAccessToken(accessToken);
            (function(context) {
                fbgraph.get('/me', function(error, body) {
                    if (error) {
                        reject(error)
                    }
                    var user = context.FBUserToDBUser(body);
                    var account = context.GetLinkedAccountNodeData(body, accessToken, params);
                    resolve({
                        user: user,
                        account: account
                    });
                });
            })(this)
        });
    },
    FBUserToDBUser: function(body) {
        var gravatar = this.GetGravatarImage(body.email);
        return {
            email: body.email,
            name: body.name,
            first_name: body.first_name,
            last_name: body.last_name,
            gender: body.gender,
            locale: body.locale,
            profileImg: gravatar
        };
    },
    GetLinkedAccountNodeData : function(body, accessToken, params) {
        return {
            username: body.username,
            uid: body.id,
            access_token: accessToken,
            expires_in: params.expires
        };
    },
});
