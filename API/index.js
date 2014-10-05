'use strict';
var express = require('express'),
    allowCrossDomain = require('./lib/AllowCrossDomain'),
    getUser = require('./lib/GetUser'),
    prepModel = require('./lib/prepareModel'),
    finalize = require('./lib/finalize'),
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

};


app.requestBeforeRoute = function requestBeforeRoute(server) {
  server.use(requestid());
  //server.use(ana.requestStart());
  server.use(express.bodyParser());
  server.use(express.methodOverride());
  server.use(allowCrossDomain());
  server.use(getUser());
  server.use(prepModel());
};


app.requestAfterRoute = function requestAfterRoute(server) {
    //server.use(ana.requestEnd());
    //server.use(ana.logErrors());
    server.use(finalize());
};


if (require.main === module) {
    kraken.create(app).listen(function(err) {
        if (err) {
            console.error(err.stack);
        }
    });
}


module.exports = app;
