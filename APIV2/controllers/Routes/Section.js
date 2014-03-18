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
  app.get('/sections',function(req,res){
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
      res.json({sections:ret});
    });
  });

  app.delete('/sections/:id',function(req,res){
    var resultStream = SectionsController.DeleteSection(req.params.id);
    resultStream.on('data',function(results){
      res.json(results);
    });
  });

  app.post('/sections',function(req,res){
    var body = req.body.section;
    if(body.type == 'Card'){
      var card = {
        title:body.title,
        left: 0,
        top:  0}
      var responseStream = CardsController.CreateCard(req.headers.authorization,card,[])
      responseStream.on('data',function(results){
        var data = {cardid : results.id}

        //console.log(results)
        var resultStream = SectionsController.CreateSection(body.title,body.type,body.position,body.card)
        resultStream.on('data',function(results){
          var ret = results;
          console.log('card created');
          console.log(ret);
          //{ id: '9071', type: 'Card', position: 27, card: '9008' }
          resultStream =  AttachmentController.createAttachment(data,req.headers.authorization,[],results.id)
          resultStream.on('data',function(att){
            resultStream = CardsController.LinkCardToSection(ret.id,data.cardid).on('data',function(results){
              console.log(att);
              ret.attachments = [att.attachment.id];
              console.log('asdf')
              console.log(ret);
              res.json({section:ret});
            })
          })
          //function(data,token,tags,sectionId){
        });
      })
    }else{
      console.log('new Section Plain')
      var resultStream = SectionsController.CreateSection(body.title,body.type,body.position,body.card)
      resultStream.on('data',function(results){
        console.log('returning')
        var response = CardsController.GetCard(req.headers.authorization,results.card);
        response.on('data',function(card){
          res.json({card:card.card,section:results})
          // res.json({section:results})
        })
        // res.json({section:results});
      })
    }
  });



  app.put('/sections/:id',function(req,res){
    //req.params.id
    console.log(req.body.section)
    var resultStream = SectionsController.UpdateSection(req.body.section,req.params.id);
    /* = SectionRoute.DeleteSection();*/
    resultStream.on('data',function(results){
      res.json(results)
    })
  });

};