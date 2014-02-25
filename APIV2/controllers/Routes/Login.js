
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var nconf = require('nconf');
var facebook = require('./../Facebook')();
module.exports = function (app) {
  'use strict';
  /* ========================================================================================================
   *
   * Passport Config Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  passport.use('facebook', new OAuth2Strategy(
    {
      authorizationURL: nconf.get('facebook_authorization_url'),
      tokenURL: nconf.get('facebook_token_url'),
      clientID: nconf.get('facebook_client_id'),
      clientSecret: nconf.get('facebook_client_secret'),
      callbackURL: nconf.get('facebook_callback_url')
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
                              return res.redirect('http://'+nconf.get('domain')+'/?token='+user.session_token);
                            }
                          })(req, res, next);
  });
};


