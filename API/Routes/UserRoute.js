var settings = require('./../settings.js')

exports.GetUser=function (req, res){

  var id = req.params.id;
  var query = 'start user=node('+id+') return user'
  var queryStream = settings.executeQuery(query,{});
  queryStream.on('data',function(results){
    var user =  {
     id: results[0].user.id,
     name: results[0].user.data.name,
     email: results[0].user.data.email
   }
   res.json({user:user})
  })

}
