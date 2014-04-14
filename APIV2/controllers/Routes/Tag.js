var TagController = require('./../TagsController.js')();
var ErrorHandler = require('./../../lib/Errors.js');

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

  app.get('/tags/:id',function(req,res,next){
    TagController.GetTags([req.params.id])
    .on('data',function(data){
      res.status = 200;
      res.returnData ={tags:data[0]}
      next()
    }).on('error',ErrorHandler.FowardErrorToBrowser(res,next));
  });

  app.get('/tags',function(req,res,next){

    if(req.query.names || req.query.ids){
      if(req.query.names){
        TagController.FindOrCreate(req.query.names)
        .on('data',function(result){
          var returnArr = [];
          for(var key in result){
            returnArr.push(result[key]);
          }
          res.status = 200;
          res.returnData ={tags:returnArr}
          next();
        }).on('error',ErrorHandler.FowardErrorToBrowser(res,next));
      }else{
        TagController.GetTags.call(TagController,req.query.ids)
        .on('data',function(results){
          res.status = 200;
          res.returnData ={tags:results}
          next();
        }).on('error',ErrorHandler.FowardErrorToBrowser(res,next));
      }
    }else{
      res.status = 200;
      res.returnData ={tags:[]}
      next();
    }
  });

  app.post('/tags',function(req,res){
    res.json(req.body);
  });

};
