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
      Proessor.ProccessAttatchment(body.data,results[0].user.id)
      .on('data',function(results){
        resultStream = AttachmentController.createAttachment(results,req.headers.authorization,[],body.sectionid)
        .on('data',function(results){
          var attachment = AttachmentController.FormatObject(results[0].attachment,body.sectionid)
          res.status = 200;
          res.returnData ={attachment:attachment}
          next();
        })
        .on('error',function(error){
          res.status = 500;
          res.returnData ={error:error}
          next();
        })
      })
      .on('error',function(error){
        res.status = 500;
        res.returnData ={error:error}
        next();
      })
    });
  });



  app.get('/attachments',function(req,res,next){
    var resultStream = AttachmentController.getAttachments(req.query.ids)
    resultStream.on('data',function(results){
      var ret = []
      for(var i = 0;i < results.length;i++){
        ret.push(AttachmentController.FormatObject( results[i].n));
      }
      res.status = 200;
      res.returnData ={attachments:ret}
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