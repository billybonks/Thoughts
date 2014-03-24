'use strict';
var express = require('express'),
    allowCrossDomain = require('./lib/AllowCrossDomain'),
    requestid = require('./lib/RequestId'),
    kraken = require('kraken-js'),
    secrets = require('./controllers/Routes/secrets.js'),
    ana = require('./lib/RequestAnalytics')(secrets.loggly),
    app = {};


app.configure = function configure(nconf, next) {
  // Async method run on startup.

  next(null);
};


app.requestStart = function requestStart(server) {
  server.use(requestid());
  server.use(ana.requestStart());
  server.use(express.bodyParser());
  server.use(express.methodOverride());
  server.use(allowCrossDomain());
};


app.requestBeforeRoute = function requestBeforeRoute(server) {

};


app.requestAfterRoute = function requestAfterRoute(server) {
  server.use(ana.requestEnd());
  server.use(ana.logErrors());
  server.use(function(req, res, next) {
    res.json(res.status,res.returnData)
  });
};


if (require.main === module) {
  kraken.create(app).listen(function (err) {
    if (err) {
      console.error(err.stack);
    }
  });
}


module.exports = app;
