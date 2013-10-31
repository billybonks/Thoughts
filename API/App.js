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
    authorizationURL: 'https://www.facebook.com/dialog/oauth',
    tokenURL: 'https://graph.facebook.com/oauth/access_token',
    clientID: '171284626406184',
    clientSecret: 'd6265fa2fd27376c2d939ecc9fe64c04',
    callbackURL: 'http://localhost:4730/auth/facebook/callback'
  },LoginRoute.OnAccessToken
));




app.get('/auth/facebook', passport.authenticate('facebook',{ scope: ['manage_pages', 'email'] }));

app.get('/auth/facebook/callback', function(req, res, next) {
  passport.authenticate('facebook',
   function(err, user, info) {
    if (err) { return next(err); }
    if (user) { return res.redirect("http://localhost/?token="+user.session_token);}
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

app.get('/links/:id')
app.update('/links/:id')
app.delete('/links/:id')
app.get('/links')
app.post('/links')*/
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