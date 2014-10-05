var TemplateController = require('./../TemplateController');//TemplateRoute
var controller = new TemplateController();

var CardController = require('./../CardController')();//TemplateRoute
var ErrorHandler = require('./../../lib/Errors.js');
var utils = require('./../../lib/utils.js');
module.exports = function (app) {
  'use strict';
  /* ========================================================================================================
   *
   * Template Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  app.get('/templates/:id',function(req,res,next){
    //TODO:This route hasnt been built
    //res.returnData ={templates:utils.arrayToJSON(templates)}
  });

  app.get('/templates',function(req,res,next){
    console.log('getting templates')
    controller.GetTemplates(req.user).then(function(templates){
      res.payload = templates;
      next();
    },ErrorHandler.error(res,next))
  });

  //FIXME: Work here after get card done
  app.post('/templates',function(req,res,next){
    var baseCard = req.body.template.basedOff;
    CardController.getCard(baseCard).then(function(card){
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

      CardController.duplicateCard(baseCard,req.user,true,null,{isTemplate:true,onMainDisplay:true}).then(function(data){
        res.status = 200;
        res.returnData={card:data};
        next();
      });
    }).on('error',ErrorHandler.error(res,next));
  });


  app.put('/templates/:id',function(req,res,next){

  });
};
