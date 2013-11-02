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
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy;


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

passport.use('facebook', new OAuth2Strategy({
    authorizationURL: settings.variables.facebook_authorization_url,
    tokenURL: settings.variables.facebook_token_url,
    clientID: settings.variables.facebook_client_id,
    clientSecret: settings.variables.facebook_client_secret,
    callbackURL: settings.variables.facebook_callback_url
  },LoginRoute.OnAccessToken
));




app.get('/auth/facebook', passport.authenticate('facebook',{ scope: ['manage_pages', 'email'] }));

app.get('/auth/facebook/callback', function(req, res, next) {
  passport.authenticate('facebook',
   function(err, user, info) {
    if (err) { console.log(err); return next(err); }
    if (user){ return res.redirect("http://"+settings.domain+"/?token="+user.session_token);}
  })(req, res, next)
});

function options(res,req,next){
  console.log('options')
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "OPTIONS,GET,DELETE,POST,PUT ")
  res.json({})
}
/*app.get('/tags/:id')
app.update('/tags/:id')
app.delete('/tags/:id')
app.get('/tags')
app.post('/tags')

app.get('/links/:id',LinksRoute.GetLink)
app.update('/links/:id',LinksRoute.UpdateLink)
app.delete('/links/:id',LinksRoute.DeleteLink)
app.get('/links',LinksRoute.GetAllLinks)
app.post('/links',LinksRoute.CreateLink)
*/
app.all('/applications', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "OPTIONS,GET,DELETE,POST,PUT ")
  next();
 });

app.get('/cards/:id',CardsRoute.GetCard)
app.put('/cards/:id',CardsRoute.UpdateCard)
app.delete('/cards/:id',CardsRoute.DeleteCard)
app.get('/cards',CardsRoute.GetAllCards)
app.post('/cards',CardsRoute.CreateCard)
app.options('/applications',options)


app.get('/applications/:id',ApplicationRoute.GetApplication)

app.get('/users/:id',UserRoute.GetUser)

app.listen(process.env.PORT || 4730);