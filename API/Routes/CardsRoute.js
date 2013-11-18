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
  }

  Card.prototype = new ServiceModule(settings);


  /* ========================================================================================================
   *
   * Read Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  Card.prototype.GetAllCards=function (token){
    var query = [
      'MATCH (user:Person)-[Created]->(card:Card)',
      'WHERE user.session_token = {token}',
      'AND not(has(card.isDeleted))',
      'RETURN user,card'
    ]
    var responseStream = new Stream()
    var variablehash = {token:token}
    var queryStream = settings.executeQuery(query.join('\n'),variablehash);
    var attachmentQuery = ['START card=node(19)',
                           'MATCH (attachment)-[:Attached]->(card)',
                           'RETURN attachment']
    var attQueryStream = settings.executeQuery(attachmentQuery.join('\n'),{});
    attQueryStream.on('data',function(results){
      console.log(results)
    })
    queryStream.on('data', function (results) {
      var ret = [];
      for(c=0;c<results.length;c++){
        var entry = {
          id: results[c].card.id,
          title: results[c].card.data.title,
          description: results[c].card.data.description,
          user: results[c].user.id,
          left: results[c].card.data.left,
          top: results[c].card.data.top,
        }
        ret.push(entry)
      }
      responseStream.emit('data',ret)
    });
    return responseStream;
  }

  //Currently sideloading data aswell
  Card.prototype.GetCard=function (token,id){
    var query=[
      'Start card=node('+id+')',
      'MATCH (user:Person)-[Created]->(card:Card) ,',
      '(attachment)-[Attached?]->(card) ',
      'WHERE user.session_token = {token}',
      'RETURN card,user,attachment,labels(attachment)'//user,card,attachment'
    ];
    console.log(query.join('\n'))

    var variableHash = {token:token}
    var queryStream = settings.executeQuery(query.join('\n'),variableHash);
    var responseStream = new Stream()
    console.log(variableHash)
    queryStream.on('data',function(results){
      var card;
      var user
      var attachmentids = [];
      var attachments = [];
      for(var i = 0;i<results.length;i++){
        console.log(results)
        var result = results[i]
        card = result.card;
        user = result.user;
        var attachment = result.attachment;
        if(attachment){
          var type = result['labels(attachment)'][0];
          attachment.type = type;
          attachmentids.push(attachment.id);
          attachments.push(attachment);
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
          attachments:attachmentids
        },
        attachments:attachments
      }
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
        var ret = results[0].b.data;
        //
        var tagStream = tagger.TagEntity(cardId,tags)
        tagStream.on('data',function(results){
          console.log(results);
          console.log(ret);
          responseStream.emit('data',ret);
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