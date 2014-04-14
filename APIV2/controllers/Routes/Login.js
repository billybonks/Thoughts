
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var nconf = require('nconf');
var facebook = require('./../Facebook')();
var github = require('./../Github')();
var google = require('./../Google')();
var OauthVars = require('./secrets')
var os = require("os");
var ErrorHandler = require('./../../lib/Errors.js');

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

  passport.use('github', new OAuth2Strategy(
    {
      authorizationURL: OauthVars.github.authorization_url,
      tokenURL:  OauthVars.github.token_url,
      clientID:  OauthVars.github.client_id,
      clientSecret:  OauthVars.github.client_secret,
      callbackURL:  OauthVars.github.callback_url
    },
    function(accessToken, refreshToken, profile, done)
    {
      github.OnAccessToken(accessToken, refreshToken, profile, done);
    }
  ));

  passport.use('google', new OAuth2Strategy(
    {
      authorizationURL: OauthVars.google.authorization_url,
      tokenURL:  OauthVars.google.token_url,
      clientID:  OauthVars.google.client_id,
      clientSecret:  OauthVars.google.client_secret,
      callbackURL:  OauthVars.google.callback_url
    },
    function(accessToken, refreshToken, profile, done)
    {
      google.OnAccessToken(accessToken, refreshToken, profile, done);
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

  app.get('/auth/github', passport.authenticate('github',{ scope: ['user:email'] }));

  app.get('/auth/github/callback', function(req, res, next) {
    passport.authenticate('github',
                          function(err, user, info) {
                            if (err) { console.log(err); return next(err); }
                            if (user)
                            {
                              return res.redirect('http://'+nconf.get('clientHostName')+'/?token='+user.session_token);
                            }
                          })(req, res, next);
  });

  app.get('/auth/google', passport.authenticate('google',{ scope: ['https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/userinfo.profile'] }));

  app.get('/auth/google/callback', function(req, res, next) {
    passport.authenticate('google',
                          function(err, user, info) {
                            if (err) { console.log(err); return next(err); }
                            if (user)
                            {
                              return res.redirect('http://'+nconf.get('clientHostName')+'/?token='+user.session_token);
                            }
                          })(req, res, next);
  });
};


