var TemplateController = require('./../TemplateController')();//TemplateRoute
var SectionController = require('./../SectionController')();//TemplateRoute
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
    var template = req.body.template;
    template.isTemplate = true;
    var sections = template.sectionsIn;
    var tags = template.tags;
    delete template.sections;
    delete template.sectionsIn;
    delete template.tags;

    var responseStream = SectionController.GetSections(sections);
    responseStream.on('data',function(results){
      responseStream = CardController.CreateCard(req.headers.authorization,template,[]);
      responseStream.on('data',function(card){
        var counter = 0;
        for(var i =0;i<results.length;i++){
          if(results[i]){
            var resultStream = SectionController.DuplicateAndLink(results[i],card.id,req.headers.authorization);
            resultStream.on('data',function(section){
              counter++;
              if(counter === results.length){
                res.status = 200;
                res.returnData ={}
                next();
              }
            });
          }
        }
      });

    });
  });


  app.put('/templates/:id',function(req,res,next){

  });
};