var AttachmentController = require('./../AttachmentController')();
var Proessor = require('./../../lib/AttachmentProccessor')();
module.exports = function (app) {
  'use strict';
  /* ========================================================================================================
   *
   * Attachment Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  app.put('/attachments/:id',function(req,res){
    //proccsss Attachment
    var resultStream = AttachmentController.updateAttachment(req.body.attachment,req.params.id)
    resultStream.on('data',function(results){
      res.json({attachment:results});
    })
  });

  app.post('/attachments',function(req,res){
    var body = req.body.attachment;
    console.log(body);
    var resultStream;
    //proccsss Attachment

    var methodName = 'Process'+body.type
    console.log(methodName)
    if(Proessor[methodName]){
      var processResultStream = Proessor[methodName](body.data);
      processResultStream.on('data',function(results){
        console.log('p results = '+results)
        body.data = results;
        resultStream = AttachmentController.createAttachment(body.data,req.headers.authorization,[],body.sectionid)
        resultStream.on('data',function(results){
          res.json(results);
        })
      })
    }else{
      resultStream = AttachmentController.createAttachment(body.data,req.headers.authorization,[],body.sectionid)
      resultStream.on('data',function(results){
        res.json(results);
      })
    }
  })



  app.get('/attachments',function(req,res){
    var resultStream = AttachmentController.getAttachments(req.query.ids)
    resultStream.on('data',function(results){
      console.log(results)
      res.json({attachments:results})
    })

  });

  app.delete('/attachments/:id',function(req,res){
    var resultStream = AttachmentController.deleteAttachment(req.params.id)
    resultStream.on('data',function(results){
      res.json()
    })

  });
};