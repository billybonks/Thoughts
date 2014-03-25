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
    var response = CardController.GetAllCards(req.headers.authorization);
    response.on('data',function(results){
      res.status = 200;
      res.returnData ={cards:results}
      next();
    });
  });

  app.get('/cards/:id',function (req,res,next){
    var response = CardController.GetCard(req.headers.authorization,req.params.id);
    response.on('data',function(results){
      var card;
      var sections = [];
      var secRet = [];
      var user;
      for(var i = 0; i < results.length;i++){
        var result = results[i];
        card = result.card;
        if(result.section){
          var section = sectionController.FormatObject(result.section);
          sections.push(section.id);
          secRet.push(section);
        }
        user =result.user;
      }
      card = CardController.FormatObject(user,[],sections,card);
      res.status = 200;
      res.returnData ={card:card}
      next();
    });// UpdateCard
  });

  app.post('/cards',function (req,res,next){
    var card = req.body.card;
    var tagsIn = card.tagsIn;
    delete card.attachments;
    delete card.tags;
    delete card.tagsIn;
    var response;
    if(card.template !== -1){
      console.log(card.template);
      response = CardController.CreateCardFromTemplate(req.headers.authorization,card,tagsIn,card.template);
    }else{
      response = CardController.CreateCard(req.headers.authorization,card,tagsIn);
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