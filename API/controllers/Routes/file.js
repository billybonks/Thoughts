var FileController = require('./../file_controller');
var controller = new FileController();
var ErrorHandler = require('./../../lib/Errors.js');
var AWS = require('aws-sdk');
var nconf = require('nconf');

module.exports = function(app) {
    'use strict';
    /* ========================================================================================================
     *
     * Configuration Methods - Keep in alphabetical order
     *
     * ===================================================================================================== */
    app.post('/file', function(req, res, next) {
        controller.uploadFile(req.model).then(function(file) {
            res.payload = file;
            next();
        }, ErrorHandler.error(res, next));

    });

    app.delete('/file', function(req, res, next) {
        controller.deleteFile(req.params.id).then(function(configurations) {
            res.status = 200;
            res.returnData = {};
            next();
        }, ErrorHandler.error(res, next));
    });

    app.put('/configurations/:id', function(req, res, next) {
        req.model.set('id',req.params.id);
        controller.updateFile(req.model).then(function(configuration) {
            res.payload = configuration;
            next();
        }, ErrorHandler.error(res, next));
    });

    app.get('/awsurl',function(req,res,next){
      var s3Conf = nconf.get('s3');
      AWS.config.update(s3Conf.creds);
      var s3 = new AWS.S3();
            var params = {Bucket: s3Conf.bucket, Key: req.user.get('id')+'/'+req.query.key,  Expires: 3600,'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'};
            s3.getSignedUrl('putObject', params, function (err, url) {
              res.returnData = url;
              res.status=200;
              next();
            });
    });

};
