var AttachmentController = require('./../AttachmentController')();
var UserController = require('./../UserController')();
var Proessor = require('./../../lib/AttachmentProccessor')();
module.exports = function (app) {
  'use strict';
  /* ========================================================================================================
   *
   * Attachment Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  app.put('/attachments/:id',function(req,res,next){
    //proccsss Attachment
    var resultStream = AttachmentController.updateAttachment(req.body.attachment,req.params.id)
    resultStream.on('data',function(results){
      var att=results[0].attachment
      res.status = 200;
      res.returnData ={attachment:{id :att.id,data:att.data}}
      next();
    })
  });

  app.post('/attachments',function(req,res,next){
    var body = req.body.attachment;
    var resultStream;
    //proccsss Attachment
    var methodName = 'Process'+body.type
    UserController.GetUser(req.headers.authorization).on('data',function(results){
      if(Proessor[methodName]){
        var processResultStream = Proessor[methodName](body.data,results[0].user.id);
        processResultStream.on('data',function(results){
          body.data = results;
          resultStream = AttachmentController.createAttachment(body.data,req.headers.authorization,[],body.sectionid)
          resultStream.on('data',function(results){
            res.status = 200;
            res.returnData =results
            next();
          })
        })
      }else{
        resultStream = AttachmentController.createAttachment(body.data,req.headers.authorization,[],body.sectionid)
        resultStream.on('data',function(results){
          res.status = 200;
          res.returnData =results
          next();
        });
      }
    });
  });



  app.get('/attachments',function(req,res,next){
    var resultStream = AttachmentController.getAttachments(req.query.ids)
    resultStream.on('data',function(results){
      res.status = 200;
      res.returnData ={attachments:results}
      next();
    })

  });

  app.delete('/attachments/:id',function(req,res,next){
    var resultStream = AttachmentController.deleteAttachment(req.params.id)
    resultStream.on('data',function(results){
      res.status = 200;
      res.returnData ={}
      next();
    })

  });
};