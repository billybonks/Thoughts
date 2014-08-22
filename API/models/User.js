var user = require('./User');
module.exports = function(data) {
  function Application(data) {
    this.model.id= data.session_token,
    this.model.token= data.session_token,
    this.model.name= data.first_name,
    this.user=user(data);
  }

  Application.prototype.toSideload = function() {
    return this.model;
  }

  return new Application(data)
}
