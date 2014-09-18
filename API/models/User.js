module.exports = function() {
  function User(node) {
    console.log(node)
      this.id = node.id;
      this.first_name = node.data.first_name;
      this.last_name = node.data.last_name;
      this.email = node.data.email;
      this.profileImg = node.data.profileImg;
      this.locale = node.data.locale;
      this.gender = node.data.gender;
      this.session_token = node.data.session_token;
  }

  User.prototype.toSideload = function() {
    return this.model;
  }

  User.parse = function(node) {
    console.log(node)
    return new User(node);
  }

  User.parseArray = function(node) {
    return new User(node);
  }
  console.log('ret user class')
  return User;
}
