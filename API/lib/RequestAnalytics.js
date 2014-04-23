'use strict';
var uuid = require('node-uuid');
var loggly = require('loggly');
module.exports = function (config) {
  function Analytics(config){
    this.client =  loggly.createClient({
      token: config.token,
      subdomain: config.subDomain,
      auth: {
        username: config.username,
        password: config.password
      },
      tags: config.globalTag,
      json: true
    });
  }

  Analytics.prototype.requestStart = function(){
    var client = this.client;
    function Log(req, res, next) {
      req.startTimeStamp = Date.now();
      next();
    };
    return Log;
  };

  Analytics.prototype.logErrors = function(){
    var client = this.client;
    function Log(req, res, next) {
      var timeStamp = Date.now();
      if(res.error){
        console.log(res.error);
        res.error.id = req.id;
        res.error.level='ERROR';
        res.error.status=res.status;
        client.log(res.error,['TRACE'],function(error,result){
          console.log('rquest error log Sent')
          if(error)
            console.log(error);
          if(result)
            console.log(result);
        });
      }
      next();
    };
    return Log;
  };

  Analytics.prototype.requestEnd = function(){
    var client = this.client;
    function Log(req, res, next) {
      if(req.method !=='OPTIONS'){
        var timeStamp = Date.now();
        var logEntry= {
          id:req.id,
          type:'requestEnd',
          path:req.path,
          requesterIp: req.ip,
          requestTime:timeStamp-req.startTimeStamp,
          level:'TRACE',
          metod:req.method
        }
        client.log(logEntry,['TRACE'],function(error,result){
          console.log('rquest end log Sent')
          if(error)
            console.log(error);
          if(result)
            console.log(result);
        });
      }
      next();
    };
    return Log;
  };


  return new Analytics(config);
};
