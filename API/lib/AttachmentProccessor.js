'use strict';
var cheerio = require('cheerio')
var request = require('request')
var url = require('url');
var fs = require('fs');
var mkpath = require('./mkpath');
var uuid = require('node-uuid');
var googleDrive = require('google-drive');
var Google = require('./../controllers/Google')();
var mime = require('mime');
var Controller = require('./../controllers/controller.js');
var googleapis = require('googleapis');
var CardController = require('./../controllers/CardController');
var cardController = new CardController();
var rsvp = require('rsvp')
var error = require('./Errors.js').reject;
var Promise = require('./promise')
//var AttachmentController = require('google-drive');
module.exports = Controller.extend({
    proccessAttatchment: function(attachment, type, action, user) {
        var context = this;
        return Promise.call(this, function(resolve, reject) {
            console.log(attachment.type)
            var methodName = ('process' + action + type);
            if (context[methodName]) {
                context[methodName](attachment, user)
                    .then(function(results) {
                        resolve(results);
                    }, function(error) {
                        reject({
                            'function': 'ProcessAttachment' + methodName,
                            type: 'attachmentProccessError',
                            innerException: error
                        })
                    })
            } else {
                resolve(attachment);
            }
        });
    },
    processCreateList: function(attachment, user) {
        var context = this;
        return Promise.call(this, function(resolve, reject) {
            var href = attachment.link;
            //if not a link try get card id
            if (typeof href == 'undefined') {
                //try find target card for link
                if (typeof attachment.card !== 'undefined') {
                    var cardid = attachment.card.substring(5);
                    cardController.getCard(cardid).then(function(card) {
                        if (results === null) {
                            //no card found with specified id
                        } else {
                            var data = {
                                title: card.get('title'),
                                card: card.get('id')
                            }
                            resolve(data);
                        }
                    }, error(reject))
                    //get card
                    //if no card Break
                    //get title
                } else {
                    //no processing required just return data
                    resolve(attachment)
                }
                //if is a link do some stuff
            } else {
                request(href, function(err, resp, html) {
                    if (err) {
                        reject(err.code);
                    }
                    var $ = cheerio.load(html);
                    var data = {
                        title: $('TITLE').text() ? $('TITLE').text() : 'no title found',
                        href: href
                    }
                    console.log('URL');
                    resolve(data);
                });
            }
        });
    }
});


/*

  AttachmentProcessor.prototype.ProcessCreateImage = function(attachment, user) {
    var context = this;
    return Promise.call(this, function(resolve, reject) {
      var regex = /^data:.+\/(.+);base64,(.*)$/;
      var matches = attachment.data.image.match(regex);
      var ext = matches[1];
      var data = matches[2];
      var buffer = new Buffer(data, 'base64');
      var name = uuid.v4() + '.' + ext;
      var path = '/data/users/' + user.id + '/images';
      mkpath.sync('./Client' + path);
      fs.writeFile('./Client' + path + '/' + name, buffer, function(err, written, buffer) {
        data = {
          image: path + '/' + name
        }
        resolve(data);
      });
    });
  }

  AttachmentProcessor.prototype.ProcessCreateDocuments = function(attachment, user) {
    var context = this;
    return Promise.call(this, function(resolve, reject) {
      Google.RefreshAccessToken(user.accounts.Google.refresh_token, user.id)
        .then(function(access_token) {
          var buffer = context.FormatData(attachment);
          context.UploadNewDocument.call(context, buffer, attachment.data.type, attachment.data.title, attachment.card, user, access_token).then(function(data) {
            resolve(data);
          })
        },error(reject))
    });
  }

  AttachmentProcessor.prototype.ProcessUpdateDocuments = function(attachment, user) {
    var context = this;
    return Promise.call(this, function(resolve, reject) {
      Google.RefreshAccessToken(user.accounts.Google.refresh_token, user.id)
        .then(function(access_token) {
          var buffer = context.FormatData(attachment);
          context.UpdateDocument.call(context, buffer, attachment.data.type, attachment.data.title, attachment.data.foreign_id, access_token).then(function(data) {
            resolve(data);
          })
        },error(reject));
    });
  }

  //used in document upload
  //TODO:
  AttachmentProcessor.prototype.FormatData = function(attachment) {
    if (attachment.data.type === "") {
      var mimeType = mime.lookup(attachment.data.title);
      attachment.data.data = attachment.data.data.replace('data:;', 'data:' + mimeType + ';');
      attachment.data.type = mimeType
    }
    var regex = /^data:.+\/(.+);base64,(.*)$/;
    var matches = attachment.data.data.match(regex);
    var ext = matches[1];
    var data = matches[2];
    return new Buffer(data, 'base64');
  }

  AttachmentProcessor.prototype.UploadNewDocument = function(buffer, mimeType, title, cardId, user, access_token) {
    var context = this;
    return Promise.call(this, function(resolve, reject) {
      this.FindRoot(access_token).then(function(rootId) {
        context.FindAttachmentFolder(access_token, cardId, rootId).then(function(parentFolder) {
          var auth = new googleapis.OAuth2Client();
          auth.setCredentials({
            access_token: access_token
          });
          googleapis.discover('drive', 'v2').execute(function(err, client) {
            var res = client
              .drive.files.insert({
                title: title,
                mimeType: mimeType,
                parents: [parentFolder]
              })
            if (mimeType.indexOf('image') === -1) {
              console.log('converting');
              res.params.convert = true
            }
            res.withMedia('application/base64', buffer)
              .withAuthClient(auth)
              .execute(function(err, result) {
                var data = {
                  link: result.webContentLink,
                  foreign_id: result.id,
                  title: result.title,
                  downloadUrl: result.downloadUrl,
                  iconLink: result.iconLink
                }
                resolve(data);
              });
          })
        })
      }, function(error) {})
    });
  }

  AttachmentProcessor.prototype.UpdateDocument = function(buffer, mimeType, title, fileId, access_token) {
    var auth = new googleapis.OAuth2Client();
    var context = this;
    return Promise.call(this, function(resolve, reject) {
      auth.setCredentials({
        access_token: access_token
      });
      googleapis.discover('drive', 'v2').execute(function(err, client) {
        client
          .drive.files.update({
            fileId: fileId
          }, {
            title: title,
            mimeType: mimeType
          })
          .withMedia('application/base64', buffer)
          .withAuthClient(auth)
          .execute(function(err, result) {

            if (result) {
              var data = {
                link: result.webContentLink,
                foreign_id: result.id,
                title: result.title,
                downloadUrl: result.downloadUrl,
                iconLink: result.iconLink
              }
              resolve(data);
            } else {
              console.log(err)
              reject(err);
            }
          });
      })
    });
  }

  AttachmentProcessor.prototype.GetDocumentAttachment = function(cardId, title) {
    var query = ['Start card=node(' + cardId + ')',
      'Match attachment-[:Attached]->card',
      'where attachment.title = {title}',
      'return attachment'
    ];
    var variableHash = {
      title: title
    };
    return this.executeQueryRSVP(query.join('\n'), variableHash);
  }

  AttachmentProcessor.prototype.FindRoot = function(accessToken) {
    var context = this;
    return Promise.call(this, function(resolve, reject) {
      googleDrive(accessToken).files().list({
          q: "'root' in parents and title='Cards' and mimeType = 'application/vnd.google-apps.folder'"
        },
        function(err, response, body) {
          body = JSON.parse(body);
          if (err) {
            console.log('error')
          }
          if (!body.error) {
            if (body.items.length == 0) {
              var folder = {
                "title": "Cards",
                "mimeType": "application/vnd.google-apps.folder"
              }
              googleDrive(accessToken).files().insert(folder, {}, function(err, response, body) {
                body = JSON.parse(body);
                resolve(body.id);
              });
            } else {
              rresolve(body.items[0].id);
            }
          } else {
            rejcet({});
          }
        });
    });
  }

  AttachmentProcessor.prototype.FindAttachmentFolder = function(accessToken, cardId, rootId) {
    var context = this;
    return Promise.call(this, function(resolve, reject) {
      var url = "https://www.googleapis.com/drive/v2/files/0B7cV1rUiPOCJcjc4NVc5bEJsMkk/children?";
      var query = "q=title%3D'" + cardId + "'+and+mimeType+%3D+'application%2Fvnd.google-apps.folder'";
      var authValue = 'Bearer ' + accessToken;
      url = url + query
      var options = {
        url: url,
        headers: {
          Authorization: authValue
        }
      }
      request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          var body = JSON.parse(body);
          if (body.items.length === 0) {
            var folder = {
              "title": cardId,
              "mimeType": "application/vnd.google-apps.folder",
              "parents": [{
                "id": rootId
              }]
            }
            googleDrive(accessToken).files().insert(folder, {}, function(err, response, body) {
              body = JSON.parse(body);
            });
            resolve(body.items[0]);
          } else {
            resolve(body.items[0]);
          }
        }
      });
    });
  }

  AttachmentProcessor.prototype.SaveDocument = function(accessToken) {

  }
*/
