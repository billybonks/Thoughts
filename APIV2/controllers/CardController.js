//var UserRoute = require('./UserRoute.js')
var Stream = require('stream');
//var TagsRoute = require('./TagsRoute.js')
var UserController = require('./UserController.js');
var controller = require('./controller.js');


module.exports = function(){
  'use strict';
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function Card(){
    this.user = new UserController();
    //this.tags = new TagsRoute();
    //this.sections = new SectionsRoute();;
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
      'AND not(has(card.isTemplate))',
      'AND not(card-[:Is]->())',
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
        resultStream.on('data',function(results){
          var sections = [];
          var sectionIds = [];
          var result,card,user,section,tag;
          for(var i = 0;i<results.length;i++){

            result = results[i];
            card = result.card;
            user = result.user;
            section = result.section;
            tag = result.tag;
            if(section){
              sections[section.id] = section;
              sectionIds.push(section.id);
            }
            /* if(tag){
              var id = tag.id;
              var tag = Object.clone(tag.data);
              tag['id'] = id;
              tags[tag.id] = tag;
            }*/
          }
          ret.push(context.FormatObject(user,tag,sectionIds,card));
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
    var query=[
      'Start card=node('+id+')',
      'MATCH (user:Person)-[Created]->(card:Card)',
      'OPTIONAL MATCH  (section)<-[h:Has]-(card),',
      '(tag)-[Tagged]->(card)',
      'WHERE user.session_token = {token}',
      'AND not(has(section.isDeleted))',
      'RETURN card,user,section,tag'//user,card,attachment'
    ];
    var variableHash = {token:token};
    var queryStream = this.executeQuery(query.join('\n'),variableHash);
    var responseStream = new Stream();
    queryStream.on('data',function(results){
      responseStream.emit('data',results);
    });
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
    /// console.log(data)
    var newCard = 'CREATE (n:Card {data}) RETURN n';
    var newCardHash = {data:data};
    var user = this.user;
    var responseStream = new Stream();
    var tagger = this.tags;
    delete newCardHash.data.user;
    var queryStream = this.executeQuery(newCard,newCardHash);
    queryStream.on('data', function (results) {
      var cardId = results[0].n.id;
      var response = user.CreatedEntity(token,cardId);
      response.on('data', function (results) {
        var user = results.user;
        var card = {
          id:results.entity.id,
          title:results.entity.data.title,
          top:results.entity.data.top,
          left:results.entity.data.left,
          user:results.user.id
          //tags
        };
        if(tags.length > 1){
          var resultStream = tagger.TagEntity(cardId,tags);
          resultStream.on('data',function(results){
            responseStream.emit('data',results);
          });
        }else{
          responseStream.emit('data',card);
        }
      });
    });
    return responseStream;
  };

  Card.prototype.CreateCardFromTemplate = function(token,data,tags,templateId){
    var responseStream = this.GetCard(token,templateId);
    var DuplicateCard = this.DuplicateCard;
    var context = this;
    responseStream.on('data',function(results){
      delete results.card.id;
      delete results.card.isTemplate;
      var responseStream = DuplicateCard.call(context,data,results.card.sections,results.card.tags,token);
    });
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
              console.log(card);
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
    var queryStream = this.executeQuery(query.join('\n'),{});
    queryStream.on('data',function(results){
      responseStream.emit(results);
    });
    return responseStream;
  };

  /* ========================================================================================================
   *
   * Helper Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  Card.prototype.FormatObject=function(user,tags,sections,card){
    var ret = {
      id:card.id,
      title:card.data.title,
      description:card.data.description,
      left:card.data.left,
      top:card.data.top,
      user:user.id,
      tags:[],
      sections:[]
    };
    for(var id in tags){
      //ret.card.tags.push(id);
    }
    for(id in sections){
      ret.sections.push(sections[id]);
    }
    return ret;
  };

  return new Card();
};
