var TemplateController = require('./../TemplateController')();//TemplateRoute
var CardController = require('./../CardController')();//TemplateRoute
var ErrorHandler = require('./../../lib/Errors.js');

module.exports = function (app) {
  'use strict';
  /* ========================================================================================================
   *
   * Template Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  app.get('/templates/:id',function(req,res,next){
    var template = req.body.template;
    template.isTempalte = true;
    //TODO:This route hasnt been built
  });

  app.get('/templates',function(req,res,next){
    TemplateController.GetTemplates(req.headers.authorization).then(function(templates){
      res.status = 200;
      res.returnData ={templates:templates}
      next();
    },ErrorHandler.FowardErrorToBrowser(res,next))
  });

  //FIXME: this stuff needs to be moved into a model
  app.post('/templates',function(req,res,next){
    var baseCard = req.body.template.basedOff;
    CardController.GetCard(baseCard).on('data',function(card){
      var children = card.children;
      var attachments = card.attachments;
      var tags = card.tags;

      delete card.user;
      delete card.id;
      delete card.configuration;
      delete card.attachments;
      delete card.children;
      delete card.parents;
      delete card.tags;

      card.isTemplate = true;
      card.onMainDisplay = false;


      console.log(req.headers.authorization);
      CardController.DuplicateCard(baseCard,req.headers.authorization,true,null,{isTemplate:true,onMainDisplay:true}).on('data',function(data){
        console.log('return INFO is')
        console.log(data);
        res.status = 200;
        res.returnData={card:data};
        next();
      }).on('error',ErrorHandler.FowardErrorToBrowser(res,next));
    }).on('error',ErrorHandler.FowardErrorToBrowser(res,next));
  });


  app.put('/templates/:id',function(req,res,next){

  });
};
