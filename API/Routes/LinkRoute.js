var settings = require('./../settings.js')


exports.GetAllLinks=function (req, res){
  var query = [
    'MATCH (user:Person)-[Created]->(link:Link)',
    'WHERE user.session_token = {token}',
    'RETURN user,link'
  ]
  var variablehash = {token:req.headers['authorization']}
  var queryStream = settings.executeQuery(query.join('\n'),variablehash);
  queryStream.on('data', function (results) {
      var ret = [];
      for(c=0;c<results.length;c++){
        var entry = {
          id: results[c].link.id,
          title: results[c].link.data.title,
          href: results[c].link.data.href,
          user: results[c].user.id,
        }
        ret.push(entry)
      }
      console.log(results);
      console.log(ret);
      res.json({links:ret})
    });
}

exports.GetLink=function (req, res){
  res.json({ideas:links[req.params.id-1]})
}

exports.DeleteLink=function (req, res){

}

exports.UpdateLink=function (req, res){
  var query = ['START link=node('+req.params.id+')',
               'SET link.title = {title},',
               'link.description = {description},',
               'link.href = {href},',
               ' RETURN link'];
  var variableHash = req.body.link;
  delete variableHash['user'];
  var queryStream = settings.executeQuery(query.join('\n'),variableHash);
  queryStream.on('data',function(results){
     res.json({})
  })
}

exports.CreateLink=function (req, res){
  var newLink = 'CREATE (n:Link {data}) RETURN n';
  var newLinkHash = {data:req.body.link};
  delete newLinkHash.data['user'];
  var queryStream = settings.executeQuery(newLink,newLinkHash);
  queryStream.on('data', function (results) {
    console.log(results);
    var linkPersonRelationShip =  [
      'START link=node('+results[0].n.id+')',
      'MATCH (user:Person)',
      'WHERE user.session_token = {token}',
      'CREATE user-[r:Created]->link',
      'RETURN link'
    ];
    var linkRelHash = {token:req.headers['authorization']}
    console.log(linkPersonRelationShip.join('\n'))
    var relStream = settings.executeQuery(linkPersonRelationShip.join('\n'),linkRelHash);
    relStream.on('data', function (results) {
      console.log(results);
      res.json({link:results[0].b.data});
    });
  });
}