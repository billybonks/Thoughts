var TemplateController = require('./../TemplateController')();//TemplateRoute
var CardController = require('./../CardController')();//TemplateRoute
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
    // var response = CardsRoute.CreateCard(req.headers['authorization'],,req.body.template.tagsIn)
  });

  app.get('/templates',function(req,res){
    var GetObject = TemplateController.GetObject;
    TemplateController.GetTemplates(req.headers.authorization).on('data',function(results){
      var ret = [];
      for(var i = 0; i< results.length;i++){
        ret.push(GetObject(results[i].template));
      }
      res.status = 200;
      res.returnData ={templates:ret}
      next();
    });

  });

  app.post('/templates',function(req,res,next){
    var template = req.body.template.basedOff;
    console.log(template)
    template.isTemplate = true;
    template.onMainDisplay = true;
    CardController.GetCard()
    /*responseStream = CardController.CreateCard(req.headers.authorization,template,[])
    .on('data',function(card){
    });*/
  });


  app.put('/templates/:id',function(req,res,next){

  });
};