var model = require('./model')();
module.exports = function() {

    function Configuration(node) {
        this.data = {};
        this.relationships = []
        this.belongsTo('configures','card');
        this.belongsTo('for','card');
        if (node) {
            this.data.id = node.id;
            this.data.position = node.position;
            this.data.embedded = node.embedded;
        }
    }

    Configuration.prototype = new model();

    return Configuration;
}
