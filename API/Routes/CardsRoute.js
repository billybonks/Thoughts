//require staements
var ServiceModule = require('./ServiceModule.js')
var UserRoute = require('./UserRoute.js')
var Stream = require('stream');
var TagsRoute = require('./TagsRoute.js')

module.exports = function(settings){

  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function Card(settings){
    this.user = new UserRoute(settings);
    this.tags = new TagsRoute(settings);
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
      'RETURN card'
    ]
    var responseStream = new Stream()
    var variablehash = {token:token}
    var queryStream = settings.executeQuery(query.join('\n'),variablehash);
    var GetCard = this.GetCard;
    queryStream.on('data', function (results) {
      var cardsCount = results.length
       var counter= 0;
      console.log('retCount = '+cardsCount)
      console.log('retCount = '+counter)
     if(cardsCount == 0){
      responseStream.emit('data',
 {
     id: 2,
     title: 'Garden packs',
     description: 'Need to find an easy way to work with soil, test it and improve it, so that packs can be built in large quantities',
     user: 1,
     left: 600,
     top: 0
 })
     }
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

  //Currently sideloading data aswell
  Card.prototype.GetCard=function (token,id){
    var query=[
      'Start card=node('+id+')',
      'MATCH (user:Person)-[Created]->(card:Card) ,',
      '(section:Section)<-[Has?]-(card),',
      '(tag:Tag)-[Tagged?]->(card)',
      'WHERE user.session_token = {token}',
      'RETURN card,user,section,tag'//user,card,attachment'
    ];
    // console.log(query.join('\n'))

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
    console.log('Creating card Tag')
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
        var card = results.entity;
        tagger.TagEntity(cardId,tags)
        tagger.responseStream.once('TagEntity.done',function(results){
          console.log('tagger');
          console.log(results);
          responseStream.emit('data',results);
        })
      });
    });
    return responseStream;
  }

  Card.prototype.DeleteCard=function (token, id){
    var responseStream = this.DeleteEntity(id);
    return responseStream;
  }

  Card.prototype.UpdateCard=function (data,id){
    var query = ['START card=node('+id+')',
                 'SET card.title = {title},',
                 'card.description = {description},',
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

  return new Card(settings)
}