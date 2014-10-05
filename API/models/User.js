'use strict';
var DS = require('./../lib/ds');

module.exports = DS.Model.extend({
  name: DS.attr('string'),
  email: DS.attr('string'),
  profileImg: DS.attr('string'),
  firstname: DS.attr('string')
});

/*var model = require('./model')();
module.exports = function() {
  function User(node) {
    this.data ={};
    if(node){
      this.data.id = node.id;
      this.data.first_name = node.data.first_name;
      this.data.last_name = node.data.last_name;
      this.data.email = node.data.email;
      this.data.profileImg = node.data.profileImg;
      this.data.locale = node.data.locale;
      this.data.gender = node.data.gender;
      this.data.session_token = node.data.session_token;
    }
  }

  User.prototype = new model();

  return User;
}*/
