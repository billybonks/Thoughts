var SectionsController = require('./../SectionController')();
var CardsController = require('./../CardController')();
var AttachmentController = require('./../AttachmentController')();
module.exports = function (app) {
  'use strict';
  /* ========================================================================================================
   *
   * Section Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  app.get('/sections',function(req,res,next){
    var resultStream = SectionsController.GetSections(req.query.ids);

    resultStream.once('data',function(results){
      var ret = [];
      var attachments = [];
      for(var section in results){
        ret.push(SectionsController.FormatObject(results[section],results[section].attachments,results[section].card));
        for(var att in results[section].attachments){
          attachments.push(results[section].attachments[att])
        }
      }
      res.status = 200;
      res.returnData ={sections:ret}
      next();
    });
  });

  app.delete('/sections/:id',function(req,res,next){
    var resultStream = SectionsController.DeleteSection(req.params.id);
    resultStream.on('data',function(results){
      res.status = 200;
      res.returnData ={}
      next();
    });
  });

  app.post('/sections',function(req,res,next){
    var body = req.body.section;
    if(body.type == 'Card'){
      var card = {
        title:body.title,
        left: 0,
        top:  0}
      var responseStream = CardsController.CreateCard(req.headers.authorization,card,[])
      responseStream.on('data',function(results){
        var data = {cardid : results.id}
        var resultStream = SectionsController.CreateSection(body.title,body.type,body.position,body.card)
        resultStream.on('data',function(results){
          var ret = results;
          //{ id: '9071', type: 'Card', position: 27, card: '9008' }
          resultStream =  AttachmentController.createAttachment(data,req.headers.authorization,[],results.id)
          resultStream.on('data',function(att){
            console.log('atttttttttttt')
            console.log(att);
            resultStream = CardsController.LinkCardToSection(ret.id,data.cardid).on('data',function(results){
              ret.attachments = [att[0].attachment.id];
              res.status = 200;
              res.returnData ={section:ret}
              next();
            })
          })
        });
      })
    }else{
      var resultStream = SectionsController.CreateSection(body.title,body.type,body.position,body.card)
      resultStream.on('data',function(results){
        var response = CardsController.GetCard(req.headers.authorization,results.card);
        response.on('data',function(card){
          res.status = 200;
          res.returnData ={card:card.card,section:results}
          next();
        })
      })
    }
  });



  app.put('/sections/:id',function(req,res,next){
    //req.params.id
    var resultStream = SectionsController.UpdateSection(req.body.section,req.params.id);
    /* = SectionRoute.DeleteSection();*/
    resultStream.on('data',function(results){
      res.status = 200;
      res.returnData =results
      next();
    })
  });

};