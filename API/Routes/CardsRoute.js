var settings = require('./../settings.js')

exports.GetAllCards=function (req, res){
  console.log(settings.SOME_FILE)
  res.json({ideas:cards})
}

exports.GetCard=function (req, res){
  res.json({ideas:cards[req.params.id-1]})
}

exports.DeleteCard=function (req, res){

}

exports.UpdateCard=function (req, res){

}

exports.CreateCard=function (req, res){
    var newCard = 'CREATE (n:Card {data}) RETURN a';
    var CardPersonRelationShip = "MATCH (person:Person),(node({id}) WHERE person.name = 'Node A' AND card.id = 'Node B'  CREATE a-[r:CREATED]->card RETURN r";
    neo4j.connect('http://localhost:7474/db/data/', function (err, graph, done) {

        graph.query(query, { data: user.id }, function (err, results) {

        });
    });
}



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