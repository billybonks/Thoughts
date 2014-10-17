var AttachmentController = require('./../AttachmentController');
var controller = new AttachmentController();
var UserController = require('./../UserController')();
var AttachmentProccessor = require('./../../lib/AttachmentProccessor');
var processor = new AttachmentProccessor();
var ErrorHandler = require('./../../lib/Errors.js');
module.exports = function(app) {
    'use strict';
    /* ========================================================================================================
     *
     * Attachment Methods - Keep in alphabetical order
     *
     * ===================================================================================================== */

    app.get('/attachments', function(req, res, next) {
        var resultStream = controller.getAttachments(req.query.ids).then(function(attachments) {
            res.payload = attachments;
            next();
        }, ErrorHandler.error(res, next))
    });

    //FIXME: needs to use req.model
    app.put('/attachments/:id', function(req, res, next) {
        //proccsss Attachment
        processor.proccessAttatchment(req.body.attachment,req.body.type, 'Update', req.user)
            .then(function(results) {
                var attachment = req.body.attachment;
                attachment.data = results;
                var resultStream = controller.updateAttachment(attachment, req.params.id)
                resultStream.on('data', function(attachment) {
                    res.status = 200;
                    res.returnData = attachment;
                    next();
                }).on('error', ErrorHandler.error(res, next));
            });
    });

    app.post('/attachments', function(req, res, next) {
        var attachment = req.model;
        processor.proccessAttatchment(attachment.getVectorData(),attachment.get('type'), 'Create', req.user).then(function(results) {
            attachment.set('data', results)
            controller.createAttachment(attachment, req.user).then(function(attachment) {
                res.payload = attachment;
                next();
            }, ErrorHandler.error(res, next))
        }, ErrorHandler.error(res, next))
    });

    app.delete('/attachments/:id', function(req, res, next) {
        var resultStream = controller.deleteEntity(req.params.id).then(function(results) {
            res.status = 200;
            res.returnData = {}
            next();
        }, ErrorHandler.error(res, next));
    });
};
