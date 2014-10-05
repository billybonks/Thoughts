//require staements
var Stream = require('stream');
var fbgraph = require('fbgraph');
var GitHubApi = require("github");
var error = require('./../lib/Errors.js').reject;
var Promise = require('./../lib/promise');
var AccountController = require('./AccountController.js');

module.exports = AccountController.extend({
    accountType: 'Github',
    GetOAuthUser: function(accessToken, refreshToken, params) {
        return Promise.call(this, function(resolve, reject) {
            var github = new GitHubApi({
                // required
                version: "3.0.0",
                // optional
                timeout: 5000
            });
            var context = this;
            github.authenticate({
                type: "oauth",
                token: accessToken
            });
            github.user.get({}, function(err, res) {
                if (err) {
                    reject(err);
                }
                var user = context.OAuthUserToDBUser(res);
                var account = context.GetLinkedAccountNodeData(res, accessToken);
                resolve({
                    user: user,
                    account: account
                });
            });
        });
    },
    OAuthUserToDBUser: function(body) {
        var gravatar = this.GetGravatarImage(body.email);
        var nameArr = body.name.split(' ')
        var firstName = nameArr[0];
        var lastName
        if (nameArr.length > 1) {
            lastName = nameArr[nameArr.length - 1];
        }
        return {
            email: body.email,
            name: body.name,
            first_name: firstName,
            last_name: lastName,
            location: body.locale,
            profileImg: gravatar
        };
    },
    GetLinkedAccountNodeData: function(body, accessToken) {
        return {
            username: body.login,
            uid: body.id,
            access_token: accessToken,
            expires_in:''
        };
    }
});
