//require staements
var seviceModule = require('./ServiceModule.js');
var Stream = require('stream');
module.exports = function(settings){

  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function User(){
  }

  User.prototype = new seviceModule(settings);

  /* ========================================================================================================
   *
   * Read Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  User.prototype.GetUser=function (req, res){
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
  /* ========================================================================================================
   *
   * Write Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  User.prototype.CreatedEntity = function(token,id){
        var cardPersonRelationShip =  [
        'START b=node('+id+')',
        'MATCH (a:Person)',
        'WHERE a.session_token = {token}',
        'CREATE a-[r:Created]->b',
        'RETURN b'
      ];
      var cardRelHash = {token:token}
      var responseStream = new Stream();
      var relStream = settings.executeQuery(cardPersonRelationShip.join('\n'),cardRelHash);
      relStream.on('data', function (results) {
        responseStream.emit(results[0].b.data)
      });
    return responseStream;
  }

  return new User();
}

