//require staements
var seviceModule = require('./ServiceModule.js')
var Stream = require('stream');

module.exports = function(settings){

  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function Card(){
  }

  Card.prototype = new seviceModule(settings);

  /* ========================================================================================================
   *
   * Read Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  Card.prototype.GetAllCards=function (token){
    var query = [
      'MATCH (user:Person)-[Created]->(card:Card)',
      'WHERE user.session_token = {token}',
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
  Card.prototype.CreateCard=function (token,data){
    var newCard = 'CREATE (n:Card {data}) RETURN n';
    var newCardHash = {data:data};
    var responseStream = new Stream();
    delete newCardHash.data['user'];
    var queryStream = settings.executeQuery(newCard,newCardHash);
    queryStream.on('data', function (results) {
      console.log(results);
      var cardPersonRelationShip =  [
        'START b=node('+results[0].n.id+')',
        'MATCH (a:Person)',
        'WHERE a.session_token = {token}',
        'CREATE a-[r:Created]->b',
        'RETURN b'
      ];
      var cardRelHash = {token:token}
      var relStream = settings.executeQuery(cardPersonRelationShip.join('\n'),cardRelHash);
      relStream.on('data', function (results) {
        responseStream.emit(results[0].b.data)
      });
    });
    return responseStream;
  }

  Card.prototype.DeleteCard=function (token, id){
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

  return new Card()
}

/*START b=node(5)
MATCH (a:Person)
WHERE a.session_token = 'a3cc727c7e3e04af4740240bf47c70c2'
CREATE a-[r:Created]->b
RETURN a,b*/
var cards = [
  {
    id: 1,
    title: 'Perma culture townships',
    description: 'its hectic, thats why we need to implement permaculture into the townships. like imagine community dumping spots where everything is organised. organic matter, recyclables etc etc etc.only issue is i wonder what the scale is, so would have to have many around the place. then you use the organic matter to make compost. use recyclables for crazy projects like plastic bottle couches',
    user: 1,
    left: 0,
    top: 0

  },
  {
    id: 2,
    title: 'Garden packs',
    description: 'Need to find an easy way to work with soil, test it and improve it, so that packs can be built in large quantities',
    user: 1,
    left: 600,
    top: 0
  },
  {
    id: 3,
    title: 'Why is a interactive board cool',
    description: 'Dynamically allows you to ',
    user: 1,
    left: 1200,
    top: 0
  },
  {
    id: 4,
    title: 'Make a fucking psytrance party',
    description: 'swaroop babji nuff said, teach these minds about some crazy mind bending psytrance',
    user: 1,
    left: 600,
    top: 300
  },
  {
    id: 5,
    title: 'rdp houses',
    description: 'one idea would be to build vertical gardens on the roofs,very well implemented in Mauritius because of hurricanes, Flat roofed houses present other challenges, such as leaking etc. Not to mention the increased cost of the structure, to support the increased weight',
    user: 1,
    left: 0,
    top: 400
  },
  {
    id: 6,
    title: 'Soil Improvement stratergy',
    description: 'some loream ipsum for you',
    user: 1,
    left: 1200,
    top: 300
  },
  {
    id: 7,
    title: 'attacth usefull facebook posts',
    description: 'some loream ipsum for you',
    user: 1,
    left: 1200,
    top: 600
  },
  {
    id: 8,
    title: 'just a quick place for some site builds',
    description: 'allow ideas to "buildFrom" "buildTo" "Linked" \n minimize entire card so only title visible',
    user: 1,
    left: 600,
    top: 600
  },
  {
    id: 9,
    title: 'Test case',
    description: 'Afrika burn planning, finding ideas groups building with strangers',
    user: 1,
    left: 600,
    top: 600
  }
]