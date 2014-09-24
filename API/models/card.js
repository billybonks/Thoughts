var model = require('./model')();
module.exports = function() {

    function Card(node) {
      this.data = {};
      this.relationships = []
    }

    Card.prototype = new model();

    return Card;
}
