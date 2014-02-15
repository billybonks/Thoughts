//require staements
var ServiceModule = require('./ServiceModule.js');
var Stream = require('stream');
module.exports = function(settings){

  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function User(settings){
  }

  User.prototype = new ServiceModule(settings);

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

  User.prototype.GetUser=function (token){
    var query = 'Match (user:Person) where user.session_token = {token} return user'
    var queryStream = settings.executeQuery(query,{token:token});
    var returnStream = new Stream();
    queryStream.on('data',function(results){
      var user =  {
        id: results[0].user.id,
        name: results[0].user.data.name,
        email: results[0].user.data.email
      }
      returnStream.emit('data',user);
    });
    return returnStream;
  }
  /* ========================================================================================================
   *
   * Write Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  User.prototype.CreatedEntity = function(token,id){
        var cardPersonRelationShip =  [
        'START entity=node('+id+')',
        'MATCH (user:Person)',
        'WHERE user.session_token = {token}',
        'CREATE user-[r:Created]->entity',
        'RETURN user,entity'
      ];
      var cardRelHash = {token:token}
      var responseStream = new Stream();
      var relStream = settings.executeQuery(cardPersonRelationShip.join('\n'),cardRelHash);
      relStream.on('data', function (results) {
        console.log(results[0])
        responseStream.emit('data',results[0]);
      });
    return responseStream;
  }

  User.prototype.SawEntity = function(token,id){

  }

  User.prototype.ClickedEntity = function(token,id){

  }

  User.prototype.UsedEntity = function(token,id){

  }
  return new User(settings);
}

