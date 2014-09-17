var TagController = require('./../TagsController.js')();
var ErrorHandler = require('./../../lib/Errors.js');

module.exports = function(app) {
  'use strict';
  /* ========================================================================================================
   *
   * Tag Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

  app.get('/tags/:id', function(req, res, next) {
    TagController.GetTags([req.params.id]).then(function(data) {
      res.status = 200;
      res.returnData = {
        tags: data[0]
      }
      next()
    }, ErrorHandler.FowardErrorToBrowser(res, next))
  });

  app.get('/tags', function(req, res, next) {
    if (req.query.names) {
      TagController.FindOrCreate(req.query.names)
        .then(function(result) {
          var returnArr = [];
          for (var key in result) {
            returnArr.push(result[key]);
          }
          res.status = 200;
          res.returnData = {
            tags: returnArr
          }
          next();
        }, ErrorHandler.FowardErrorToBrowser(res, next))
    } else {
      console.log('BOUT TO GET EM TAGS')
      TagController.GetTags(req.query.ids).then(function(results) {
          res.status = 200;
          res.returnData = {
            tags: results
          }
          next();
        }, ErrorHandler.FowardErrorToBrowser(res, next))
    }
  });

  app.post('/tags', function(req, res) {
    res.json(req.body);
  });

};
