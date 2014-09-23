module.exports = function() {

    function Model() {

    }

    Model.prototype.flatten = function(node) {
        node.data.id = node.id;
        return node.data;
   }

    return Model;
}
