var neo4j = require('neo4j-js');
var nconf = require('nconf');
//var ember = require('ember');
var Promise = require('./../lib/promise')
var error = require('./../lib/Errors').reject;
var adapter = require('./../lib/adapter');
var CoreObject = require('./../lib/core_object');
var utils = require('./../lib/utils');

var neo4j = require('neo4j-js');
var nconf = require('nconf');
var rsvp = require('rsvp');
module.exports = CoreObject.extend({
    init: function(node) {
        this.ignoreDic = {};
        this.data = {};
        this.relationships = [];
        this.attrIndex = [];
        this.relationshipIndex = [];
        for (var key in this) {
            if (this[key].direction) {
                //console.log('found attr');
                //  console.log(key);
                this[key].name = key
                if (this[key].direction == 'attr') {
                    //  console.log('pushing to attr index')
                    this.attrIndex.push(key);
                } else {
                    //  console.log('pushing rel attr index')
                    this.relationshipIndex.push(key);
                }
            }
        }
    },
    update: function(node) {
        for (var key in node) {
            if(key ==='isDeleted'){
              this.data['isTrashed'] = node[key];
            }
            this.data[key] = node[key];
        }
    },
    flatten: function(node) {
        var ret = this._clone(node.data);
        ret.id = node.id;
        return ret;
    },
    //PARSES A ARAY OF MULTIPLE CORE OBJECTS RETURNS GROUP, SHOULD BE STATIC (REOPEN CLASS NEEDED)
    parseMutliArray:function(results,type){
      var dict ={};
      for (var i = 0; i < results.length; i++) {
          var model
          if(dict[results[i].node.id]){
            model = dict[results[i].node.id]
          }
          model = new type();
          model.parse(results[i]);
          dict[model.get('id')] =model;
      }
      return utils.dictionaryToArray(dict);
    },
    //PARSES A SINGLE ARRAY ONLY ONE CORE OBJECT
    parseArray: function(arr) {
        for (var i = 0; i < arr.length; i++) {
            if (i === 0) {
                this.update(this.flatten(arr[0].node));
            }
            for (var j = 0; j < this.relationshipIndex.length; j++) {
                relatedVector = arr[i][this.relationshipIndex[j]];
                if (relatedVector) {
                    this.parseRelatedVector(this.relationshipIndex[j], relatedVector)
                }
            }
        }
    },
    //FIXME: this.ignoreDic[model.get('id')] = true; this is a quick fix can be improved
    parseRelatedVector: function(relationship, relatedVector) {
        var definition = this[relationship]
        var model = this.parseRelatedModel(relationship, relatedVector);
        if (!this.ignoreDic[model.get('id')]) {
            if (definition.amount === 'single') {
              this.ignoreDic[model.get('id')] = true;
                this.set(relationship, model)
            } else {
                if (!this.get(relationship))
                    this.set(relationship, []);
                this.ignoreDic[model.get('id')] = true;
                this.get(relationship).push(model);
            }
        }
    },
    //FIXME:some of this code is duplicated with parseArray
    parse: function(data, parseRel) {
        var vector = data.node;
        this.update(this.flatten(vector));
        for (var i = 0; i < this.relationshipIndex.length; i++) {
            relatedVector = data[this.relationshipIndex[i]];
            if (relatedVector) {
                this.parseRelatedVector(this.relationshipIndex[i], relatedVector)
            }
        }

    },
    parseRelatedModel: function(relationship, relatedVector) {
        var model = this.getRelationshipModel(this[relationship].type);
        model = new model();
        relatedVector = this.flatten(relatedVector)
        model.update(relatedVector);
        return model;
    },
    getRelationshipModel: function(type) {
        return require('./' + type);
    },
    getVectorData: function(node) {
        var data = this._clone(this.data);
        data = this._clearRelationships(data);
        delete data.id;
        return this._cleanNulls(data)
    },
    //FIXME: this needs to work of relationshipindex and attrindex
    getJSON: function(node) {
        var ret = {};
        for (var key in this.data) {
            if (this.data[key] !== null) {
                if (typeof this.data[key] !== "undefined") {
                    if (this.data[key].getJSON) {
                        ret[key] = this.data[key].get('id');
                    } else if (this.data[key] instanceof Array) {
                        var tempArr = []
                        for (var i = 0; i < this.data[key].length; i++) {
                            if (this.data[key][i].getJSON)
                                tempArr.push(this.data[key][i].get('id'))
                            else
                                tempArr.push(this.data[key][i])
                        }
                        ret[key] = tempArr;
                    } else
                        ret[key] = this.data[key];
                } else {
                    ret[key] = null;
                }
            }
        }
        return ret;
    },
    get: function(attribute) {
        return this.data[attribute];
    },
    set: function(attribute, data) {
        this.data[attribute] = data;
    },
    _clone: function(data) {
        var clone = {}
        for (var key in data) {
            clone[key] = data[key];
        }
        return clone;
    },
    _valid: function(value) {
        if (value === null) {
            return false;
        }
        if (typeof value === "undefined") {
            return false
        }
        return true;
    },
    //sql injection?
    save: function() {
        var data = {};
        var query = ['Start node=node(' + this.get('id') + ')'];
        for (var i = 0; i < this.attrIndex.length; i++) {
            var attribute = this.attrIndex[i]
            var attributeDeclecration = this[attribute];
            if (this._valid(this.get(attribute))) {
                query.push('SET node.' + attribute + ' = {' + attribute + '}');
                data[attribute] = this.get(attribute)
            }
        }
        query.push('RETURN node');
        query = query.join('\n')
        return this._executeQuery(query, data)
    },
    _clearRelationships: function(data) {
        for (var i = 0; i < this.relationshipIndex.length; i++) {
            delete data[this.relationshipIndex[i]];
        }
        return data;
    },
    _cleanNulls: function(data) {
        for (var prop in data) {
            if (data[prop] !== 0) {
                if (data[prop] === false)
                    continue;
                if (!data[prop]) {
                    delete data[prop]
                }
            }
        }
        return data;
    },
    sideLoadAbleData: function() {
        var ret = {};
        for (var i = 0; i < this.relationshipIndex.length; i++) {
            var relationship = relationshipIndex[i];
            var definition = this[relationship]
            if (data.get(relationship)) {
                if (definition.amount === 'single') {
                    ret[type] = data.get(relationship).getVectorData();
                } else {
                    ret[utils.toPlural(type)] = utils.arrayToJSON(data.get(relationship));
                }
            }
        }
        return ret;
    },
    _executeQuery: function(query, variableHash) {
        return new rsvp.Promise(function(resolve, reject) {
            neo4j.connect(nconf.get('database'), function(err, graph, done) {
                graph.query(query, variableHash, function(err, results) {
                    if (err) {
                        reject({
                            type: 'queryError',
                            innerException: err
                        });
                    } else {
                        resolve(results);
                    }
                });
            });
        });
    }
});
