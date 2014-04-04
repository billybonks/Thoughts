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
        var resultStream = context.GetCard.call(context,token,id);
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

  Card.prototype.GetCard=function (token,id){
    var context = this;
    var query=[
      'Start card=node('+id+')',
      'MATCH (user:Person)-[Created]->(card:Card)',
      'OPTIONAL MATCH  (tag)-[t:Tagged]->(card)',
      'OPTIONAL MATCH  (attachment)-[a:Attached]->(card)',
      'OPTIONAL MATCH  (child)<-[h:Has]-(card)',
      'WHERE user.session_token = {token}',
      'AND not(has(child.isDeleted))',
      'RETURN card,user,child,tag,attachment'//user,card,attachment'
    ];
    var variableHash = {token:token};
    var queryStream = this.executeQuery(query.join('\n'),variableHash);
    var responseStream = new Stream();
    queryStream.on('data',function(results){
      console.log('init results')
      console.log(results);
      var card = context.FormatNeo4jObject(results);
      ConfigurationController.GetCardConfigurations(card.id)
      .on('data',function(data){
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

  Card.prototype.CreateSubCard = function(token,data,tags,templateId,parentId){
    var response;
    var returnStream = new Stream();
    var context = this;
    if(templateId !== -1){
      response = this.CreateCardFromTemplate(token,data,tags,templateId);
    }else{
      response = this.CreateCard(token,data,tags);
    }
    response.on('data',function(results){
      var query = ['Start child=node('+results.id+') , parent=node('+parentId+')',
                   'CREATE parent-[r:Has]->child',
                   'return child']
      context.executeQuery(query.join('\n'),{})
      .on('data',function(data){
        results.parents = [parentId];
        returnStream.emit('data',results);
      })
    })
    return returnStream;
  };


  Card.prototype.DeleteCard=function (token, id){
    var responseStream = this.DeleteEntity(id);
    return responseStream;
  };

  Card.prototype.DuplicateCard = function(data,sections,tags,token){
    var resultStream = new Stream();
    var responseStream = this.sections.GetSections(sections);
    var CardsRoute = this;
    var SectionRoute = this.sections;

    responseStream.on('data',function(results){
      responseStream = CardsRoute.CreateCard.call(CardsRoute,token,data,tags);
      responseStream.on('data',function(card){
        var counter = 0;
        for(var i =0;i<results.length;i++){
          resultStream = SectionRoute.DuplicateAndLink.call(SectionRoute,results[i],card.id,token);
          resultStream.on('data',function(section){
            counter++;
            if(counter === results.length){
              resultStream.emit('data',{});
            }
          });
        }
      });

    });
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
        console.log('config target start');
        console.log(result.for)
        console.log('config target end');
      }
      if(result.for){
        console.log('config target start');
        console.log(result.for)
        console.log('config target end');
      }
      user =result.user;
    }
    card = this.FormatObject(user,tags,children,card,attachments,[]);//configurations);
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
      //ret.configurations.push(id);
    }
    return ret;
  };

  return new Card();
};
