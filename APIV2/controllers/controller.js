var rsvp = require('rsvp');
var nconf = require('nconf');
var neo4j = require('neo4j');
var neo4js = require('neo4j-js');
module.exports = function() {
  'use strict';
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function Controller() {

  }
  /* ========================================================================================================
   *
   * Helper Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  Controller.prototype.createNode = function(data, label) {
    var context = this;
    data = this.cleanNulls(data);
    return new rsvp.Promise(function(resolve, reject) {
      var query = 'CREATE (n:' + label + ' {data}) RETURN n';
      var params = {
        data: data
      }
      context.executeQuery(query, params).then(function(results) {
        results = context.flatten(results[0].n);
        resolve(results);
      }, function(err) {
        reject(err);
      })
    })
  }

  Controller.prototype.deleteNode = function(id) {
    var context = this;
    return new rsvp.Promise(function(resolve, reject) {
      var query = [
        'Start node=node(' + id + ')',
        'Match node-[r]-x',
        'DELETE node,r'
      ].join('\n');
      console.log(query);
      return context.executeQuery(query, {});
    })
  }

  Controller.prototype.updateNode = function(id, data) {
    var context = this;
    data = this.cleanNulls(data)
    return new rsvp.Promise(function(resolve, reject) {
      var query = ['Start node=node(' + id + ')'];
      for (var prop in data) {
        query.push('SET node.' + prop + ' = \'' + data[prop] + '\'');
      }
      query.push('RETURN node');
      query = query.join('\n')
      var params = {
        data: data
      }
      context.executeQuery(query, params).then(function(results) {
        resolve(results);
      }, function(error) {
        reject(error);
      });
    })
  }

  Controller.prototype.createRelationShip = function(source, target, label) {
    var query = [
      'START source=node(' + source + '),target=node(' + target + ')',
      'CREATE source-[r:' + label + ']->target',
      'RETURN source'
    ].join('\n');
    return this.executeQuery(query, {});
  }


  Controller.prototype.executeQuery = function(query, params) {
    var context = this;
    var db = new neo4j.GraphDatabase(nconf.get('database'));
    return new rsvp.Promise(function(resolve, reject) {
      db.query(query, params, function(err, results) {
        if (err) {
          /*  var message = err.message;
            if (message.indexOf('reach database') > 0) {
              err = {
                statusCode: 500
              }
            } else {
              err = {
                statusCode: 404
              }
            }*/
          reject(err);
        } else {
          resolve(results);
        }
      })
    })

  }

  Controller.prototype.genStartIds = function(ids) {
    var ret = 'Start node=node('
    for (var i = 0; i < ids.length; i++) {
      if (ids.length === (i + 1)) {
        ret += ids[i];
      } else {
        ret += ids[i] + ','
      }
    }
    ret += ')'
    return ret;
  }

  Controller.prototype.cleanNulls = function(data) {
    for (var prop in data) {
      if (data[prop] !== 0) {
        if (!data[prop]) {
          delete data[prop]
        }
      }
    }
    return data;
  }

  Controller.prototype.clearRelationships = function(data) {
    for (var i = 0; i < this.relationships.length; i++) {
      delete data[this.relationships[i]];
    }
    return data;
  }

  Controller.prototype.flatten = function(node) {
    node.data.id = node.id;
    return node.data;
  }

  Controller.prototype.flattenArray = function(array) {
    var ret = []
    for (var i = 0; i < array.length; i++) {
      ret.push(this.flatten(array[i].node));
    }
    return ret;
  }

  Controller.prototype.dictionaryToArray = function(dict) {
    var ret = [];
    for (var id in dict) {
      ret.push(dict[id])
    }
    return ret;
  }

  Controller.prototype.parseResults = function(results) {
    var resultDict = {};
    for (var i = 0; i < results.length; i++) {
      var result = results[i];
      for (var prop in result) {
        var data = context.flatten(result[prop]);
        if (prop === 'node') {
          if (!resultDict[data.id]) {

          }
        }
      }
    }
  }

  Controller.prototype.createId = function() {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + this.s4() + this.s4();
  }

  Controller.prototype.s4 = function() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return new Controller();
};
