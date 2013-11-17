//require
var express = require('express');
var request = require('request');
var neo4j = require('neo4j-js')
var fbgraph = require('fbgraph')
var settings = require('./settings.js')
var passport = require('passport')
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

var LoginRoute = require('./Routes/LoginRoute')
//Route Requires
var LinksRoute = require('./Routes/LinkRoute')(settings);
var CardsRoute = require('./Routes/CardsRoute')(settings);
var ApplicationRoute = require('./Routes/ApplicationRoute')(settings);
var UserRoute = require('./Routes/UserRoute')(settings);

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
var app = express();
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(allowCrossDomain);

/* ========================================================================================================
 *
 * OAuth Setup - Keep in alphabetical order
 *
 * ===================================================================================================== */
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
                          if (user){ return res.redirect("http://"+settings.variables.domain+"/?token="+user.session_token);}
                        })(req, res, next)
});

/* ========================================================================================================
 *
 * Application Methods - Keep in alphabetical order
 *
 * ===================================================================================================== */

app.get('/applications/:id',function (req,res){ApplicationRoute.GetApplication(req,res)})


/* ========================================================================================================
 *
 * Cards Methods - Keep in alphabetical order
 *
 * ===================================================================================================== */
app.delete('/cards/:id',function (req,res){
                          var response = CardsRoute.DeleteCard(req.headers['authorization'],req.params.id)
                          response.on('data',function(results){
                            res.json({})
                          })
                      });

app.get('/cards',function (req,res){
                      var response = CardsRoute.GetAllCards(req.headers['authorization']);
                      response.on('data',function(results){
                      res.json({cards:results})
                    })//res.json(ret);
});
app.get('/cards/:id',function (req,res){
                      var response = CardsRoute.GetCard(req.headers['authorization'],req.params.id);
                      response.on('data',function(results){
                        res.json(results)
                      })// UpdateCard
                     });
app.post('/cards',function (req,res){
                      var response = CardsRoute.CreateCard(req.headers['authorization'],req.body.card)
                      response.on('data',function(results){
                        res.json({card:results})
                      })
                  });
app.put('/cards/:id',function (req,res){
                      var response = CardsRoute.UpdateCard(req.body.card,req.params.id)
                      response.on('data',function(results){
                        res.json({})
                      })
                  });

app.get('/attachments',function(req,res){console.log('a');console.log(req.query)})
app.post('/attachments',function(req,res){console.log(req.body)})

/* ========================================================================================================
 *
 * Links Methods - Keep in alphabetical order
 *
 * =====================================================================================================*/
app.delete('/links/:id',function (req,res){
  var response = LinksRoute.deleteAttachment(req.params.id)
  response.on('data',function(results){
    res.json(results);
  })
})
app.get('/links',function (req,res){LinksRoute.GetAllLinks(req,res)})
app.get('/links/:id',LinksRoute.GetLink)
app.post('/links',function (req,res){
  var responseStream = LinksRoute.GetLinkTitle(req.body.link.href);
  responseStream.on('error',function(error){})
  responseStream.on('data',function(results){LinksRoute.createAttachment('Link',results,req.headers['authorization'])})
});
// app.update('/links/:id',LinksRoute.UpdateLink)

/* ========================================================================================================
 *
 * Users Methods - Keep in alphabetical order
 *
 * ===================================================================================================== */
app.get('/users/:id',function (req,res){UserRoute.GetUser(req,res)})

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



