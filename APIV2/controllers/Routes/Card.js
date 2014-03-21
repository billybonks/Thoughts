var CardController= require('./../CardController')();
var sectionController = require('./../SectionController')();

module.exports = function (app) {
  'use strict';
  /* ========================================================================================================
   *
   * Card Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

  app.delete('/cards/:id',function (req,res){
    var response = CardController.DeleteCard(req.headers.authorization,req.params.id);
    response.on('data',function(results){
      res.json({});
    });
  });

  app.get('/cards',function (req,res){
    var response = CardController.GetAllCards(req.headers.authorization);
    response.on('data',function(results){
      res.json({cards:results});
    });
  });

  app.get('/cards/:id',function (req,res){
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
      res.json({card:card});
    });// UpdateCard
  });

  app.post('/cards',function (req,res){
    console.log(req.body.card.tagsIn);
    var card = req.body.card;
    console.log(card);
    var tagsIn = card.tagsIn;
    delete card.attachments;
    delete card.tags;
    delete card.tagsIn;
    var response;
    if(card.template !== -1){
      response = CardController.CreateCardFromTemplate(req.headers.authorization,card,tagsIn,card.template);
    }else{
      response = CardController.CreateCard(req.headers.authorization,card,tagsIn);
    }
    response.on('data',function(results){
      res.json({card:results});
    });
  });

  app.put('/cards/:id',function (req,res){
    var response = CardController.UpdateCard(req.body.card,req.params.id);
    response.on('data',function(results){
      res.json({});
    });
  });
};