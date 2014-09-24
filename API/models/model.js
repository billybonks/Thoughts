module.exports = function() {

    function Model() {
        this.relationships = []
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

    Model.prototype.parse = function(data) {
        var vector = data.node;
        this.update(this.flatten(vector));
        for (var i = 0; i < this.relationships.length; i++) {
            relatedVector = data[this.relationships[i].name];
            if (relatedVector) {
                var model = this.getRelationshipModel(this.relationships[i].type);
                model = new model();
                relatedVector = this.flatten(relatedVector)
                model.update(relatedVector);
                this.set(this.relationships[i].name,model)
            }
        }

    }
    Model.prototype.getRelationshipModel = function(type) {
      return require('./'+type)();
    }

    Model.prototype.getVectorData = function(node) {
        var data = this._clone(this.data);
        data = this.clearRelationships(data);
        return this.cleanNulls(data)
    }

    Model.prototype.getJSON = function(node) {
        var ret = {};
        for(var key in this.data){
          if(this.data[key].getJSON){
            ret[key] = this.data[key].get('id');
          }else{
            ret[key] = this.data[key];
          }
        }
        console.log(ret)
        return ret;
    }

    Model.prototype.get = function(attribute) {
        return this.data[attribute];
    }

    Model.prototype.set = function(attribute,data) {
        this.data[attribute] = data;
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
            delete data[this.relationships[i].name];
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

    Model.prototype.hasMany = function(name, type) {
        this.relationships.push({
            name: name,
            type: type,
            direction: 'in'
        })
    }

    Model.prototype.belongsTo = function(name, type) {
        this.relationships.push({
            name: name,
            type: type,
            direction: 'out'
        })
    }

    return Model;
}
