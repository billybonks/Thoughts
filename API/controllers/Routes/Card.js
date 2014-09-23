var CardController= require('./../CardController')();
var TagsController = require('./../TagsController.js')();
var TryParse = require('./../../lib/TryParse');
var Stream = require('stream');
var ErrorHandler = require('./../../lib/Errors.js');
module.exports = function (app) {
  'use strict';
  /* ========================================================================================================
   *
   * Card Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

  app.delete('/cards/:id',function (req,res,next){
    CardController.DeleteCard(req.headers.authorization,req.params.id).then(function(results){
      res.status = 200;
      res.returnData ={}
      next();
    });//FIXME: add error handling
  });

  app.get('/cards',function (req,res,next){
    var ids = req.query.ids;
     var cardController = CardController;
    if(ids){
      var count = ids.length;
      var counter = 0;
      var returnArray = []

      for(var i = 0;i <ids.length;i++){
        CardController.GetCard(ids[i])
        .on('data',function(card){
          counter++;
          var card = cardController.FormatObject(card.user,card.tags,card.children,card.card,card.attachments,card.parents,card.configurations);
          returnArray.push(card);
          if(counter == count){
            res.status = 200;
            res.returnData ={cards:returnArray}
            next();
          }
        })
        .on('error',ErrorHandler.FowardErrorToBrowser(res,next));
      }
    }else{
      var ret= [];
      CardController.GetAllCards(req.headers.authorization)
      .on('data',function(results){
        for(var i = 0; i < results.length;i++){
          var card = results[i];
          card = cardController.FormatObject(card.user,card.tags,card.children,card.card,card.attachments,card.parents,card.configurations);
          ret.push(card);
        }
        res.status = 200;
        res.returnData ={cards:ret}
        next();
      })
      .on('error',ErrorHandler.FowardErrorToBrowser(res,next));
    }
  });

  app.get('/cards/:id',function (req,res,next){
    var cardController = CardController;
    var response = CardController.GetCard(req.params.id);
    response.on('data',function(card){
      var card = cardController.FormatObject(card.user,card.tags,card.children,card.card,card.attachments,card.parents,card.configurations)
      res.status = 200;
      res.returnData ={card:card}
      next();
    }).on('error',ErrorHandler.FowardErrorToBrowser(res,next));
  });

  app.post('/cards',function (req,res,next){
    var card = req.body.card;
    var tags = card.tags;
    var parents = card.parents;
    var children = card.children
    var responseStream =new Stream();
    card.isTemplate = false;
    delete card.attachments;
    delete card.tags;
    delete card.parents;
    delete card.children;
    var response;
    if(!isNaN(card.type)){
      var template = card.type;
      delete card.type;
      var props = {isTemplate:false,onMainDisplay:true,title:card.title}
      if(parents.length !== 0){
        props.onMainDisplay = false;
      }
      CardController.DuplicateCard(template,req.headers.authorization,true,null,props).on('data',function(root){
          TagsController.TagEntity(tags,root.id).then(function(tagRes){
            for(var i = 0; i < tagRes.length;i++){
             // tagHash[tagRes[i].tag.id]=tagRes[i].tag.data;
              root.tags.push(tagRes[i].tag.id);
            }
            responseStream.emit('data',root);
          });
      })
    }else{
      CardController.CreateCard(req.headers.authorization,card,tags).on('data',function(root){
        responseStream.emit('data',root)
      })
    }
    responseStream.on('data',function(results){
      var card = results;
      if(parents.length !== 0){
        CardController.LinkChild(results.id,parents[0]).on('data',function(){
            card.parents = parents;
            res.status = 200;
            res.returnData ={card:card}
            next();
        });
      }else{
        res.status = 200;
        res.returnData ={card:card}
        next();
      }
    }).on('error',ErrorHandler.FowardErrorToBrowser(res,next));
  });

  app.put('/cards/:id',function (req,res,next){
    var response = CardController.UpdateCard(req.body.card,req.params.id);
    response.on('data',function(results){
      res.status = 200;
      res.returnData ={}
      next();
    }).on('error',ErrorHandler.FowardErrorToBrowser(res,next));
  });
};
