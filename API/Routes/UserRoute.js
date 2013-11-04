//require staements
var seviceModule = require('./ServiceModule.js')

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
  return new User();
}

