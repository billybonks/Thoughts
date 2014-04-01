var CardController= require('./../CardController')();
var sectionController = require('./../SectionController')();

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
    if(ids){
      var count = ids.length;
      var counter = 0;
      var returnArray = []
      for(var i = 0;i <ids.length;i++){
        CardController.GetCard(req.headers.authorization,ids[i])
        .on('data',function(results){
          counter++;
          returnArray.push(CardController.FormatNeo4jObject(results));
          if(counter == count){
            res.status = 200;
            res.returnData ={cards:returnArray}
            next();
          }
        });
      }
    }else{
      CardController.GetAllCards(req.headers.authorization)
      .on('data',function(results){
        res.status = 200;
        res.returnData ={cards:results}
        next();
      });
    }
  });

  app.get('/cards/:id',function (req,res,next){

    console.log('getting someeeeeeeeeeeeeeeeeee')
    var response = CardController.GetCard(req.headers.authorization,req.params.id);
    response.on('data',function(results){
      var card = CardController.FormatNeo4jObject(results);
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
      if(card.template !== -1){
        console.log(card.template);
        response = CardController.CreateCardFromTemplate(req.headers.authorization,card,tags,card.template);
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