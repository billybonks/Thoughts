module.exports = function() {

    function Model() {

    }

    Model.prototype.update = function(node) {
        for (var key in node) {
            this.data[key] = node[key];
        }
    }
    Model.prototype.flatten = function(node) {
        var ret = this._clone(node.data);
        ret.id = node.id;
        return ret;
    }

    Model.prototype.parse = function(node) {
        this.update(this.flatten(node));
    }

    Model.prototype.getVectorData = function(node) {
        var data = this._clone(this.data);
        data = this.clearRelationships(data);
        return this.cleanNulls(data)
    }

    Model.prototype.getJSON = function(node) {
        return this.data;
    }

    Model.prototype.get = function(attribute) {
        return this.data[attribute];
    }

    Model.prototype._clone = function(data) {
        var clone = {}
        for (var key in data) {
            clone[key] = data[key];
        }
        return clone;
    }

    Model.prototype.clearRelationships = function(data) {
        for (var i = 0; i < this.relationships.length; i++) {
            delete data[this.relationships[i]];
        }
        return data;
    }

    Model.prototype.cleanNulls = function(data) {
        for (var prop in data) {
            if (data[prop] !== 0) {
                if (!data[prop]) {
                    delete data[prop]
                }
            }
        }
        return data;
    }
    return Model;
}
