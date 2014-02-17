//var Tag = require('./../Tag.js')();

module.exports = function (app) {
  'use strict';
  /* ========================================================================================================
   *
   * Tag Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */


  /*app.get('/tags',function(req,res){
    var responseStream = Tag.GetTags(req.query.ids);
    responseStream.on('data',function(results){
      var ret = [];
      for(var i =0;i<results.length;i++){
        ret.push(Tag.Tag.FormatObject(results[i].n));
      }
      res.json({tags:ret});
    });
  });

  app.post('/tags',function(req,res){
    var tag = req.body.tag;
    Tag.CreateTag(tag.title,tag.description).on('data',function(results){
      res.json({tag:Tag.FormatObject(results[0].n)});
    });

  });*/
  app.post('/tags',function(req,res){
    res.json(req.body);
  });

};
