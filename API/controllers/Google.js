//require staements
var Stream = require('stream');
var request = require('request');
var OauthVars = require('./Routes/secrets')
var refresh = require('google-refresh-token');
var error = require('./../lib/Errors.js').reject;
var Promise = require('./../lib/promise');
var AccountController = require('./AccountController.js');

module.exports = AccountController.extend({
    accountType: 'Google',
    GetOAuthUser: function(accessToken, refreshToken, params) {
        return Promise.call(this, function(resolve, reject) {
            var context = this;
            var authValue = 'Bearer ' + accessToken;
            var options = {
                url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
                headers: {
                    Authorization: authValue
                }
            };

            request(options, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var info = JSON.parse(body);
                    var user = context.OAuthUserToDBUser(info);
                    var account = context.GetLinkedAccountNodeData(info, accessToken, refreshToken, params);
                    resolve({
                        user: user,
                        account: account
                    });
                } else if (err) {
                    reject(error)
                }
            });
        });
    },
    OAuthUserToDBUser: function(body) {
        return {
            email: body.email,
            name: body.name,
            first_name: body.given_name,
            last_name: body.family_name,
            location: body.locale,
            profileImg: body.picture
        };
    },
    GetLinkedAccountNodeData: function(body, accessToken, refreshToken, params) {
        return {
            username: body.email,
            uid: body.id,
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: params.expires_in
        };
    },
    GetAccessToken: function(refreshToken) {
        return Promise.call(this, function(resolve, reject) {
            refresh(refreshToken, OauthVars.google.client_id, OauthVars.google.client_secret, function(err, json, res) {
                console.log(json)
                if (err) reject(error)
                if (json.error) reject(json.error)

                var newAccessToken = json.accessToken;
                if (!newAccessToken) {
                    console.log('no access token')
                }
                if (newAccessToken) {
                    console.log('returning')
                    resolve({
                        access_token: newAccessToken,
                        expires_in: json.expiresIn
                    })
                }
            });
        });
    },
});
