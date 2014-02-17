'use strict';
var express = require('express'),
    allowCrossDomain = require('./lib/AllowCrossDomain'),
    kraken = require('kraken-js'),
    app = {};


app.configure = function configure(nconf, next) {
  // Async method run on startup.
  next(null);
};


app.requestStart = function requestStart(server) {
  server.use(express.bodyParser());
  server.use(express.methodOverride());
  server.use(allowCrossDomain());
};


app.requestBeforeRoute = function requestBeforeRoute(server) {
  server.use(express.bodyParser());
  server.use(express.methodOverride());
  server.use(allowCrossDomain());
};


app.requestAfterRoute = function requestAfterRoute(server) {
  server.use(express.bodyParser());
  server.use(express.methodOverride());
  server.use(allowCrossDomain());
};


if (require.main === module) {
  kraken.create(app).listen(function (err) {
    if (err) {
      console.error(err.stack);
    }
  });
}


module.exports = app;
