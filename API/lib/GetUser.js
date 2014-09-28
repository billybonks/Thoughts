'use strict';
var UserController = require('./../controllers/UserController')();
module.exports = function () {

  return  function(req, res, next) {
    var auth = req.headers.authorization;
    console.log('getting user')
    console.log(auth)
    UserController.GetUser(auth).then(function(user){
      console.log('USER FOUND')
      req.user = user
      next();
    },function(error){
      console.log('error user');
      console.log(error);
      if(error.statusCode === 404){
        if(req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE'){
          //TODO: return forbidden
          next();
        }else{
          //check if resource is public
          next();
        }
      }
    })

  };
};
