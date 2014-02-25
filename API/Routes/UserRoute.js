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
  User.prototype.GetUserById=function (req, res){
    var id = req.params.id;
    var FormatApplicationObject = this.FormatApplicationObject;
    var query = 'start user=node('+id+') return user'
    var queryStream = settings.executeQuery(query,{});
    queryStream.on('data',function(results){
      var user = FormatApplicationObject(results[0].user);
      res.json({user:user})
    })
  }

  User.prototype.GetUser=function (token){
    var query = 'Match (user:Person) where user.session_token = {token} return user'
    // console.log(token)
    return settings.executeQuery(query,{token:token});
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

  User.prototype.FormatApplicationObject = function(object){
    return {
      id: object.id,
      name: object.data.name,
      email: object.data.email,
      firstname: object.data.first_name,
      lastname: object.data.last_name,
      profileImg: object.data.profileImg,
    };
  }
  User.prototype.SawEntity = function(token,id){

  }

  User.prototype.ClickedEntity = function(token,id){

  }

  User.prototype.UsedEntity = function(token,id){

  }
  return new User(settings);
}

