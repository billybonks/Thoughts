
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var nconf = require('nconf');
var facebook = require('./../Facebook')();
var OauthVars = require('./secrets')
var os = require("os");

console.log(os.hostname());
module.exports = function (app) {
  'use strict';
  /* ========================================================================================================
   *
   * Passport Config Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  passport.use('facebook', new OAuth2Strategy(
    {
      authorizationURL: OauthVars.facebook.authorization_url,
      tokenURL:  OauthVars.facebook.token_url,
      clientID:  OauthVars.facebook.client_id,
      clientSecret:  OauthVars.facebook.client_secret,
      callbackURL:  OauthVars.facebook.callback_url
    },
    function(accessToken, refreshToken, profile, done)
    {
      facebook.OnAccessToken(accessToken, refreshToken, profile, done);
    }
  ));
  /* ========================================================================================================
   *
   * Facebook Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  app.get('/auth/facebook', passport.authenticate('facebook',{ scope: ['manage_pages', 'email'] }));

  app.get('/auth/facebook/callback', function(req, res, next) {
    passport.authenticate('facebook',
                          function(err, user, info) {
                            if (err) { console.log(err); return next(err); }
                            if (user)
                            {
                              return res.redirect('http://'+nconf.get('clientHostName')+'/?token='+user.session_token);
                            }
                          })(req, res, next);
  });
};


