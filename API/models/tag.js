module.exports = function() {
  function Tag(node) {
    if (node) {
      this.id = node.id;
      this.title = node.data.title;
      this.description = node.data.description;
    }
  }

  Tag.prototype.toSideload = function() {
    return this.model;
  }

  Tag.parse = function(node) {
    return new Tag(node);
  }

  Tag.parseArray = function(node) {
    return new Tag(node);
  }

  return Tag;
}
