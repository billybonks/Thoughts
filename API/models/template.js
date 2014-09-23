module.exports = function() {
  function Template(node) {
    if (node) {
      this.id = node.id;
      this.title = node.data.title;
      this.description = node.data.description;
    }
  }

  Template.prototype.toSideload = function() {
    return this.model;
  }

  Template.parse = function(node) {
    return new Template(node);
  }

  Template.parseArray = function(results) {
    var ret = [];
    for(var i = 0; i< results.length;i++){
      ret.push(this.parse(results[i].template));
    }
    return ret;
  }

  return Template;
}
