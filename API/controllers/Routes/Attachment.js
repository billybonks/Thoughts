var AttachmentController = require('./../AttachmentController')();
var UserController = require('./../UserController')();
var Proessor = require('./../../lib/AttachmentProccessor')();
var ErrorHandler = require('./../../lib/Errors.js');
module.exports = function(app) {
    'use strict';
    /* ========================================================================================================
     *
     * Attachment Methods - Keep in alphabetical order
     *
     * ===================================================================================================== */
    app.put('/attachments/:id', function(req, res, next) {
        //proccsss Attachment
        UserController.GetFullUser(req.headers.authorization).then(function(user) {
            Proessor.ProccessAttatchment(req.body.attachment, 'Update', user)
                .then(function(results) {
                    var attachment = req.body.attachment;
                    attachment.data = results;

                    var resultStream = AttachmentController.updateAttachment(attachment, req.params.id)
                    resultStream.on('data', function(results) {
                        var att = results[0].attachment;
                        res.status = 200;
                        res.returnData = results[0];
                        next();
                    }).on('error', ErrorHandler.FowardErrorToBrowser(res, next));
                });
        });
    });

    app.post('/attachments', function(req, res, next) {
        var body = req.body.attachment;
        var resultStream;
        //proccsss Attachment
        var methodName = 'Process' + body.type
        UserController.GetFullUser(req.headers.authorization).then(function(user) {
            Proessor.ProccessAttatchment(body, 'Create', user)
                .then(function(results) {
                    AttachmentController.createAttachment(results, req.user.get('id'), [], body.card).then(function(attachment) {
                        res.status = 200;
                        res.returnData = {
                            attachment: attachment
                        }
                        next();
                    }).on('error', ErrorHandler.FowardErrorToBrowser(res, next));
                }).on('error', ErrorHandler.FowardErrorToBrowser(res, next));
        });
    });



    app.get('/attachments', function(req, res, next) {
        var resultStream = AttachmentController.getAttachments(req.query.ids).then(function(results) {
            var ret = []
            for (var i = 0; i < results.length; i++) {
                ret.push(AttachmentController.FormatObject(results[i].n));
            }
            res.status = 200;
            res.returnData = {
                attachments: ret
            }
            next();
        }, ErrorHandler.FowardErrorToBrowser(res, next))

    });

    app.delete('/attachments/:id', function(req, res, next) {
        var resultStream = AttachmentController.deleteEntity(req.params.id).then(function(results) {
            res.status = 200;
            res.returnData = {}
            next();
        }, ErrorHandler.FowardErrorToBrowser(res, next));
    });
};
