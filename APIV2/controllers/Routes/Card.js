var CardController= require('./../CardController')();
var TryParse = require('./../../lib/TryParse');
module.exports = function (app) {
  'use strict';
  /* ========================================================================================================
   *
   * Card Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

  app.delete('/cards/:id',function (req,res,next){
    var response = CardController.DeleteCard(req.headers.authorization,req.params.id);
    response.on('data',function(results){
      res.status = 200;
      res.returnData ={}
      next();
    });
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
        });
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
      });
    }
  });

  app.get('/cards/:id',function (req,res,next){
    var cardController = CardController;
    console.log('getting someeeeeeeeeeeeeeeeeee')
    var response = CardController.GetCard(req.params.id);
    response.on('data',function(card){
      console.log(card)
      var card = cardController.FormatObject(card.user,card.tags,card.children,card.card,card.attachments,card.parents,card.configurations)
      res.status = 200;
      res.returnData ={card:card}
      next();
    });// UpdateCard
  });

  app.post('/cards',function (req,res,next){
    var card = req.body.card;
    var tags = card.tags;
    var parents = card.parents;
    var children = card.children
    card.isTemplate = false;
    console.log(card);
    delete card.attachments;
    delete card.tags;
    delete card.parents;
    delete card.children;
    var response;
    if(parents.length !== 0){
      response = CardController.CreateSubCard(req.headers.authorization,card,tags,card.template,parents[0]);
    }else{
      if(!isNaN(card.type)){
        response = CardController.DuplicateCard(card.type,req.headers.authorization,true,null,{isTemplate:false,onMainDisplay:true,title:card.title});
      }else{
        response = CardController.CreateCard(req.headers.authorization,card,tags);
      }
    }
    response.on('data',function(results){
      res.status = 200;
      res.returnData ={card:results}
      next();
    });
    response.on('error',function(error){
      res.error = error;
      res.status = 500;
      next();
    })
  });

  app.put('/cards/:id',function (req,res,next){
    var response = CardController.UpdateCard(req.body.card,req.params.id);
    response.on('data',function(results){
      res.status = 200;
      res.returnData ={}
      next();
    });
  });
};