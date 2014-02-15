//require staements
var ServiceModule = require('./ServiceModule.js')
var UserRoute = require('./UserRoute.js')
var Stream = require('stream');
var TagsRoute = require('./TagsRoute.js')
var SectionsRoute = require('./SectionsRoute.js')

module.exports = function(settings){

  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function Card(settings){
    this.user = new UserRoute(settings);
    this.tags = new TagsRoute(settings);
    this.sections = new SectionsRoute(settings);;
    this.counter = 0;
  }

  Card.prototype = new ServiceModule(settings);


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
    ]
    var responseStream = new Stream()
    var variablehash = {token:token}

    var queryStream = settings.executeQuery(query.join('\n'),variablehash);
    console.log('executed')
    var GetCard = this.GetCard;
    queryStream.on('data', function (results) {

      var cardsCount = results.length
      if(cardsCount == 0){
        responseStream.emit('data',[])
      }
      var counter= 0;
      var ret = [];
      for(var c=0;c<cardsCount;c++){
        var id = results[c].card.id;
        var resultStream = GetCard(token,id)
        resultStream.on('data',function(result){
          ret.push(result.card)
          counter++
          if(cardsCount ==counter){
            responseStream.emit('data',ret)
            console.log('CARDS')
            console.log(ret)
          }
        })

      }
    });
    return responseStream;
  }

  Card.prototype.GetTemplates=function(token){
    var query = [
      'MATCH (user:Person)-[Created]->(card:Card)',
      'WHERE user.session_token = {token}',
      'AND not(has(card.isDeleted))',
      'AND has(card.isTemplate)',
      'RETURN card,user'
    ]
    console.log(query.join('\n'))
    var responseStream = new Stream()
    var variablehash = {token:token}
    var queryStream = settings.executeQuery(query.join('\n'),variablehash);
    queryStream.on('data',function(templates){
      var ret = []
      for(var i = 0;i<templates.length;i++){
        ret.push({
          id:templates[i].card.id,
          title:templates[i].card.data.title,
          user:templates[i].user.id
        });
      }
      responseStream.emit('data',ret)
      console.log(ret)
    })
    return responseStream;
  }
  //Currently sideloading data aswell
  Card.prototype.GetCard=function (token,id){
    var query=[
      'Start card=node('+id+')',
      'MATCH (user:Person)-[Created]->(card:Card) ,',
      '(section:Section)<-[h?:Has]-(card),',
      '(tag:Tag)-[Tagged?]->(card)',
      'WHERE user.session_token = {token}',
      'AND not(has(section.isDeleted))',
      'RETURN card,user,section,tag'//user,card,attachment'
    ];
    console.log(query.join('\n'))

    var variableHash = {token:token}
    console.log(query.join('\n'))
    var queryStream = settings.executeQuery(query.join('\n'),variableHash);
    var responseStream = new Stream()
    // console.log(variableHash)
    queryStream.on('data',function(results){
      // console.log(results);
      var card;
      var user
      var tags = {};
      var sections = {};
      for(var i = 0;i<results.length;i++){

        var result = results[i]
        card = result.card;
        user = result.user;
        var section = result.section;
        console.log(result)
        console.log(sections)
        var tag = result.tag;
        if(section){
          sections[section.id] = section
        }
        if(tag){
          var id = tag.id;
          var tag = Object.clone(tag.data);
          tag['id'] = id;
          tags[tag.id] = tag;
        }
      }
      var ret = {
        card:
        {
          id:card.id,
          title:card.data.title,
          description:card.data.description,
          left:card.data.left,
          top:card.data.top,
          user:user.id,
          tags:[],
          sections:[]
        },
        tags:[]
      }
      for(var id in tags){
        ret.card.tags.push(id);
      }
      for(var id in sections){
        ret.card.sections.push(id);
      }
      //  console.log(ret);
      responseStream.emit('data',ret)
    });
    return responseStream;
  }

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
    delete newCardHash.data['user'];
    var queryStream = settings.executeQuery(newCard,newCardHash);
    queryStream.on('data', function (results) {
      var cardId = results[0].n.id;
      var response = user.CreatedEntity(token,cardId)
      response.on('data', function (results) {
        var user = results.user;
        var card = {
          id:results.entity.id,
          title:results.entity.data.title,
          top:results.entity.data.top,
          left:results.entity.data.left,
          user:results.user.id
          //tags
        }
        if(tags.length > 1){
          var resultStream = tagger.TagEntity(cardId,tags)
          resultStream.on('data',function(results){
            responseStream.emit('data',results);
            console.log(results);
          })
        }else{
          responseStream.emit('data',card);
        }
      });
    });
    return responseStream;
  }

  Card.prototype.CreateCardFromTemplate = function(token,data,tags,templateId){
    var responseStream = this.GetCard(token,templateId);
    var DuplicateCard = this.DuplicateCard;
    var context = this;
    responseStream.on('data',function(results){
      delete results.card.id
      delete results.card.isTemplate
      var responseStream = DuplicateCard.call(context,data,results.card.sections,results.card.tags,token);
    })
  }


  Card.prototype.DeleteCard=function (token, id){
    var responseStream = this.DeleteEntity(id);
    return responseStream;
  }

  Card.prototype.DuplicateCard = function(data,sections,tags,token){
    var resultStream = new Stream()
    console.log('DUPPPPS')
    console.log(this);
    console.log(this.sections);
    var responseStream = this.sections.GetSections(sections);
    var CardsRoute = this;
    var SectionRoute = this.sections;

    responseStream.on('data',function(results){
      responseStream = CardsRoute.CreateCard.call(CardsRoute,token,data,tags);
      responseStream.on('data',function(card){
        var counter = 0
        for(var i =0;i<results.length;i++){
          resultStream = SectionRoute.DuplicateAndLink.call(SectionRoute,results[i],card.id,token)
          resultStream.on('data',function(section){
            counter++;
            if(counter === results.length){
              console.log(card)
              resultStream.emit('data',{})
            }
          })
        }
      })

    })
  }

  Card.prototype.UpdateCard=function (data,id){
    var query = ['START card=node('+id+')',
                 'SET card.title = {title},',
                 'card.top = {top},',
                 'card.left = {left}',
                 ' RETURN card'];
    var responseStream = new Stream();
    var variableHash = data;
    delete variableHash['user'];
    var queryStream = settings.executeQuery(query.join('\n'),variableHash);
    queryStream.on('data',function(results){
      responseStream.emit('data',results);
    })
    return responseStream;
  }

  Card.prototype.LinkCardToSection = function(sectionID,cardID){
    var responseStream = new Stream();
    var query = ['START card=node('+cardID+') ,section=node('+sectionID+')',
                 'CREATE card-[r:Is]->section',
                 'RETURN section'];
    var queryStream = settings.executeQuery(query.join('\n'),{});
    queryStream.on('data',function(results){
      responseStream.emit(results)
    })
    return responseStream;
  }
  return new Card(settings)
}