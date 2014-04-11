//var UserRoute = require('./UserRoute.js')
var Stream = require('stream');
var TagsController = require('./TagsController.js')();
var UserController = require('./UserController.js');
var controller = require('./Controller.js');
var AttachmentController = require('./AttachmentController.js')();
var ConfigurationController = require('./ConfigurationController.js')();
module.exports = function(){
  'use strict';
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function Card(){
    this.user = new UserController();

    this.counter = 0;
  }

  Card.prototype = new controller();


  /* ========================================================================================================
   *
   * Read Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  Card.prototype.GetAllCards=function (token){
    this.counter++;
    var query = [
      'MATCH (user:Person)-[Created]->(card:Card)',
      'WHERE user.session_token = {token}',
      'AND not(has(card.isDeleted))',
      'AND not(card-[:Is]->())',
      'AND card.onMainDisplay = true',
      'RETURN card'
    ];
    var context = this;
    var responseStream = new Stream();
    var variablehash = {token:token};
    var queryStream = this.executeQuery(query.join('\n'),variablehash);
    queryStream.on('data', function (results) {

      var cardsCount = results.length;
      if(cardsCount === 0){
        responseStream.emit('data',[]);
      }
      var counter= 0;
      var ret = [];
      for(var c=0;c<cardsCount;c++){
        var id = results[c].card.id;
        var resultStream = context.GetCard.call(context,id);
        resultStream.on('data',function(card){
          ret.push(card);
          counter++;
          if(cardsCount ==counter){
            responseStream.emit('data',ret);
          }
        });
      }
    });
    return responseStream;
  };

  Card.prototype.GetCard=function (id){
    var context = this;
    var query=[
      'Start card=node('+id+')',
      'MATCH (user:Person)-[Created]->(card:Card)',
      'OPTIONAL MATCH  (tag)-[t:Tagged]->(card)',
      'OPTIONAL MATCH  (attachment)-[a:Attached]->(card)',
      'OPTIONAL MATCH  (child)<-[h:Has]-(card)',
      'WHERE not(has(child.isDeleted))',
      'RETURN card,user,child,tag,attachment'//user,card,attachment'
    ];
    var queryStream = this.executeQuery(query.join('\n'),{});
    var responseStream = new Stream();
    queryStream.on('data',function(results){
      var card = context.FormatNeo4jObject(results);

      ConfigurationController.GetCardConfigurations(card.card.id)
      .on('data',function(data){
        card.configurations =[]
        card.configurations = data;
        responseStream.emit('data',card)
      })
    });
    queryStream.on('error',function(error){
      console.log(error)
      responseStream.emit('error',error);
    })
    return responseStream;
  };

  Card.prototype.GetTemplates=function(token){
    var query = [
      'MATCH (user:Person)-[Created]->(card:Card)',
      'WHERE user.session_token = {token}',
      'AND not(has(card.isDeleted))',
      'AND has(card.isTemplate)',
      'RETURN card,user'
    ];
    var responseStream = new Stream();
    var variablehash = {token:token};
    var queryStream = this.executeQuery(query.join('\n'),variablehash);
    queryStream.on('data',function(templates){
      var ret = [];
      for(var i = 0;i<templates.length;i++){
        ret.push({
          id:templates[i].card.id,
          title:templates[i].card.data.title,
          user:templates[i].user.id
        });
      }
      responseStream.emit('data',ret);
    });
    return responseStream;
  };
  /* ========================================================================================================
   *
   * Write Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  Card.prototype.CreateCard=function (token,data,tags){
    var newCard = 'CREATE (n:Card {data}) RETURN n';
    var newCardHash = {data:data};
    var user = this.user;
    var responseStream = new Stream();
    var tagger = TagsController;
    delete newCardHash.data.user;
    var context = this;
    var queryStream = this.executeQuery(newCard,newCardHash);
    queryStream.on('data', function (results) {
      var cardId = results[0].n.id;

      var response = user.CreatedEntity(token,cardId);
      response.on('data', function (results) {
        var user = results.user;
        tagger.TagEntity(tags,cardId)
        .on('data',function(taggingResults){

          var card =context.FormatObject(user,tags,[],results.entity);
          responseStream.emit('data',card);
        })
        .on('error',function(error){
          responseStream.emit('error',error);
        })
      });
    }).on('error',function(error){
      responseStream.emit('error',error);
    });
    return responseStream;
  };

  Card.prototype.CreateCardFromTemplate = function(token,data,tags,templateId){
    var responseStream = this.GetCard(token,templateId)
    var DuplicateCard = this.DuplicateCard;
    var context = this;
    var returnStream = new Stream();
    responseStream.on('data',function(results){
      delete results.card.id;
      delete results.card.isTemplate;
      responseStream = DuplicateCard.call(context,data,results.card.sections,results.card.tags,token);
      responseStream
      .on('data',function(){

      })
      .on('error',function(){
        returnStream.emit('error',error)
      });
    });
    responseStream.on('error',function(error){
      error.function = 'GetCard'
      returnStream.emit('error',error);
    });
    return returnStream;
  };

  Card.prototype.LinkChild = function(childId,parentId){
    var response;
    var returnStream = new Stream();
    var context = this;
      var query = ['Start child=node('+childId+') , parent=node('+parentId+')',
                   'CREATE parent-[r:Has]->child',
                   'return child']
      context.executeQuery(query.join('\n'),{})
      .on('data',function(data){
        returnStream.emit('data',data);
      });
    return returnStream;
  };


  Card.prototype.LinkParentToChild=function(childId,parentId){
    var returnStream = new Stream();
    var query = ['Start child=node('+childId+') , parent=node('+parentId+')',
                 'CREATE parent-[r:Has]->child',
                 'return child']
    this.executeQuery(query.join('\n'),{})
    .on('data',function(data){
      returnStream.emit('data',data);
    })
    return returnStream;
  }
  Card.prototype.DeleteCard=function (token, id){
    var responseStream = this.DeleteEntity(id);
    return responseStream;
  };

  Card.prototype.DuplicateCard = function(baseCard,token,duplicateAttatchments,parentId,variablesToReplace){
    var resultStream = new Stream();
    var context = this;

    this.GetCard(baseCard).on('data',function(payload){

      var children = payload.children;
      var attachments = payload.attachments;
      var configurations = payload.configurations;


      var card = context.FormatObject(payload.user,payload.tags,payload.children,payload.card,payload.attachments,payload.parents,payload.configurations)
      var attLength = card.attachments.length;
      var childLength = card.children.length;
      var tags = card.tags;

      delete card.user;
      delete card.id;
      delete card.configurations;
      delete card.attachments;
      delete card.children;
      delete card.parents;
      delete card.tags;

      var newAttachments = {};
      var newChildren = {};
      var newConfiguration = {};

      for(var property in variablesToReplace){
        if(card.hasOwnProperty(property)){
          card[property] = variablesToReplace[property];
        }
      }
      console.log(card)

      context.CreateCard(token,card,tags).on('data',function(root){
        TagsController.TagEntity(tags,root.id).on('data',function(data){
          var tempResponse = new Stream();
          var counter = 0;
          if(parentId){
            context.LinkParentToChild(root.id,parentId).on('data',function(data){
              tempResponse.emit('CardCreated',data);
            });
          }else{
            setTimeout(function() {
              tempResponse.emit('CardCreated',data);
            }, 100,tempResponse);
          }
          tempResponse.on('CardCreated',function(CCret){
            var counter = 0;
            if(attLength === 0){
              tempResponse.emit('attachments',root);
            }
            if(duplicateAttatchments){
              for(var id in attachments){
                AttachmentController.createAttachment(attachments[id].data,token,[],root.id).on('data',function(results){
                  counter++;
                  console.log(results);
                  var attachment = AttachmentController.FormatObject(results[0].attachment,root.id)

                  newAttachments[attachment.id] = attachment;
                  if(counter == attLength){
                    tempResponse.emit('attachments',root)
                  }
                });
              }
            }else{
              tempResponse.emit('attachments',root);
            }
          });
          tempResponse.on('attachments',function(attRet){
            var deepDiving = false;
            if(parentId){
              for(var config in configurations){
                //if(parentId == config.for){
                deepDiving = true;
                var configures = configurations[config].configures;
                delete configurations[config].for;
                delete configurations[config].configures;
                delete configurations[config].id;
                ConfigurationController.CreateCardConfiguartion(root.id,parentId,configurations[config])
                .on('data',function(results){
                  newConfiguration[results.id] = results
                  tempResponse.emit('configuration',results)
                })
                // }
                //ConfigurationController.DuplicateConfiguration(configurations[i],parentId,root.id)
              }
            }
            tempResponse.emit('configuration',{})
          });

          tempResponse.on('configuration',function(ConfigRet){
            if(childLength === 0){
              resultStream.emit('data',root);
            }
            for(var child in children){
              context.DuplicateCard.call(context,child,token,true,root.id,{isTemplate:false,onMainDisplay:false}).on('data',function(results){
                counter++;
                newChildren[results.id] = results;

                if(counter == childLength){
                  var card = {id:root.id};
                  delete root.id;

                  card.data = root;
                  if(parentId == null){
                    parentId = {};
                  }else{
                    parentId[parentId] = {};
                  }
                  console.log(token);
                  context.user.GetUser(token).on('data',function(results){
                    console.log('user')
                    console.log(results);
                    card = context.FormatObject(context.user.FormatObject(results[0].user),tags,newChildren,card,newAttachments,parentId,newConfiguration);
                    console.log(card);
                    resultStream.emit('data',card);
                  })
                }
              });
            }
          });
        });
      });

    })
    return resultStream;
  };

  Card.prototype.UpdateCard=function (data,id){
    var query = ['START card=node('+id+')',
                 'SET card.title = {title},',
                 'card.top = {top},',
                 'card.left = {left}',
                 ' RETURN card'];
    var responseStream = new Stream();
    var variableHash = data;
    delete variableHash.user;
    var queryStream = this.executeQuery(query.join('\n'),variableHash);
    queryStream.on('data',function(results){
      responseStream.emit('data',results);
    });
    return responseStream;
  };

  Card.prototype.LinkCardToSection = function(sectionID,cardID){
    var responseStream = new Stream();
    var query = ['START card=node('+cardID+') ,section=node('+sectionID+')',
                 'CREATE card-[r:Is]->section',
                 'RETURN section'];
    return this.executeQuery(query.join('\n'),{});
  };

  /* ========================================================================================================
   *
   * Helper Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  Card.prototype.FormatNeo4jObject=function(results){
    var card;
    var children = {};
    var user;
    var tags = {};
    var attachments ={}
    var configurations ={}
    for(var i = 0; i < results.length;i++){

      var result = results[i];
      card = result.card;
      if(result.child){
        var parents ={}
        parents[card.id]= card;
        var child = this.FormatObject({id:null},[],[],result.child,parents);
        children[child.id]=child;
      }
      if(result.tag){
        var tag = TagsController.FormatObject(result.tag);
        tags[tag.id]=tag;
      }
      if(result.attachment){
        var attachment = AttachmentController.FormatObject(result.attachment);
        attachments[attachment.id]=attachment;
      }
      if(result.configuration){
        var configuration = ConfigurationController.FormatObject(result.configuration);
        configurations[configuration.id]=configuration;
      }
      if(result.for){

      }
      user =result.user;
    }
    card = {
      user:user,
      card:card,
      tags:tags,
      attachments:attachments,
      configurations:[],
      parents:[],
      children:children
    }
    //card = this.FormatObject(user,tags,children,card,attachments,[]);//configurations);
    return card;
  };

  Card.prototype.FormatObject=function(user,tags,children,card,attachments,parents,configurations){
    var ret = {
      id:card.id,
      title:card.data.title,
      description:card.data.description,
      left:card.data.left,
      top:card.data.top,
      user:user.id,
      tags:[],
      children:[],
      onMainDisplay: card.data.onMainDisplay,
      isTemplate:card.data.isTemplate,
      type:card.data.type,
      attachments:[],
      configurations:[],
      parents:[]
    };
    for(var id in parents){
      ret.parents.push(id);
    }
    for(var id in tags){
      ret.tags.push(id);
    }
    for(id in children){
      ret.children.push(id);
    }
    for(id in attachments){
      ret.attachments.push(id);
    }
    for(id in configurations){
      ret.configurations.push(id);
    }
    return ret;
  };

  return new Card();
};
