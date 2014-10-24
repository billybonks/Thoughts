var TagController = require('./../TagsController.js');
var controller = new TagController();
var ErrorHandler = require('./../../lib/Errors.js');

module.exports = function(app) {
    'use strict';
    /* ========================================================================================================
     *
     * Tag Methods - Keep in alphabetical order
     *
     * ===================================================================================================== */
    //works
    app.get('/tags/:id', function(req, res, next) {
        controller.getTags([req.params.id]).then(function(data) {
            res.payload = data[0];
            next()
        }, ErrorHandler.error(res, next))
    });

    app.get('/tags', function(req, res, next) {
        if (req.query.names) {
            controller.findOrCreate(req.query.names).then(function(tags) {
                res.payload = tags;
                next();
            }, ErrorHandler.error(res, next))
        } else {
            controller.getTags(req.query.ids).then(function(tags) {
                res.payload = tags;
                next();
            }, ErrorHandler.error(res, next))
        }
    });
    app.put('/addTags',function(req,res, next){
      var promises = []
      controller.tagEntity(req.body.tags,req.body.entity).then(function(tags){
        res.status = 200;
        res.returnData = {}
        next();
      })
    })

    app.put('/removeTags',function(req,res, next){
      controller.removeTags(req.body.tags,req.body.entity).then(function(tags){
        res.status = 200;
        res.returnData = {}
        next();
      })
    })
    //never used
    app.post('/tags', function(req, res) {
        res.json(req.body);
    });

};
