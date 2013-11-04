//require
var express = require('express');
var app = express();
var request = require('request');
var neo4j = require('neo4j-js')
var fbgraph = require('fbgraph')
var LoginRoute = require('./Routes/LoginRoute')
var CardsRoute = require('./Routes/CardsRoute')
var ApplicationRoute = require('./Routes/ApplicationRoute')
var UserRoute = require('./Routes/UserRoute')
var settings = require('./settings.js')
var passport = require('passport')
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var LinksRoute = require('./Routes/LinkRoute')(settings);

passport.use('facebook', new OAuth2Strategy({
  authorizationURL: settings.variables.facebook_authorization_url,
  tokenURL: settings.variables.facebook_token_url,
  clientID: settings.variables.facebook_client_id,
  clientSecret: settings.variables.facebook_client_secret,
  callbackURL: settings.variables.facebook_callback_url
},LoginRoute.OnAccessToken
                                           ));


/* ========================================================================================================
 *
 * Http Setup - Keep in alphabetical order
 *
 * ===================================================================================================== */
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(allowCrossDomain);


/* ========================================================================================================
 *
 * HTTP Methods
 * - Keep in alphabetical order
 * - Keep in url order
 * ===================================================================================================== */


/* ========================================================================================================
 *
 * Authentication Methods - Keep in alphabetical order
 *
 * ===================================================================================================== */

app.get('/auth/facebook', passport.authenticate('facebook',{ scope: ['manage_pages', 'email'] }));

app.get('/auth/facebook/callback', function(req, res, next) {
  passport.authenticate('facebook',
                        function(err, user, info) {
                          if (err) { console.log(err); return next(err); }
                          if (user){ return res.redirect("http://"+settings.domain+"/?token="+user.session_token);}
                        })(req, res, next)
});

/* ========================================================================================================
 *
 * Application Methods - Keep in alphabetical order
 *
 * ===================================================================================================== */

  app.get('/applications/:id',ApplicationRoute.GetApplication)


/* ========================================================================================================
 *
 * Cards Methods - Keep in alphabetical order
 *
 * ===================================================================================================== */
  app.delete('/cards/:id',CardsRoute.DeleteCard)
  app.get('/cards',CardsRoute.GetAllCards)
  app.get('/cards/:id',CardsRoute.GetCard)
  app.post('/cards',CardsRoute.CreateCard)
  app.put('/cards/:id',CardsRoute.UpdateCard)


/* ========================================================================================================
 *
 * Links Methods - Keep in alphabetical order
 *
 * =====================================================================================================*/
  app.delete('/links/:id',LinksRoute.DeleteLink)
  app.get('/links',LinksRoute.GetAllLinks)
  app.get('/links/:id',LinksRoute.GetLink)
  app.post('/links',function (req,res){
             LinksRoute.CreateLink(req,res)
           });
 // app.update('/links/:id',LinksRoute.UpdateLink)

/* ========================================================================================================
 *
 * Users Methods - Keep in alphabetical order
 *
 * ===================================================================================================== */
  app.get('/users/:id',UserRoute.GetUser)

/* ========================================================================================================
 *
 * Tags Methods - Keep in alphabetical order
 *
 * ===================================================================================================== */

  /*app.get('/tags/:id')
  app.update('/tags/:id')
  app.delete('/tags/:id')
  app.get('/tags')
  app.post('/tags')*/

app.listen(process.env.PORT || 4730);



