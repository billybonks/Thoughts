var settings = require('./../settings.js')

exports.GetApplication=function (req, res){
  var sessionToken = {token:req.headers['authorization']};
  var query = 'START n=node(*) WHERE has (n.session_token) and n.session_token={token} RETURN n';//'START n=node:nodes(session_token = {token}) RETURN n';
  var queryStream = settings.executeQuery(query,sessionToken);
  queryStream.on('data', function (results) {
    if(results.length > 0){
      var data = results[0].n.data;
      data.id = data.session_token;
      var ret = {id:data.session_token,token:data.session_token,name:data.first_name}
      console.log(ret)
    }else{
      ret = [{id:sessionToken.token}];
    }
    res.json({applications:ret})
  });
}