var CoreObject = require('./../lib/core_object');
var neo4j = require('neo4j-js');
var nconf = require('nconf');
var rsvp = require('rsvp');

module.exports = CoreObject.extend({
    getNodes: function(ids) {
        var context = this;
        return new rsvp.Promise(function(resolve, reject) {
            if (ids) {
                var query = 'START node=node(';
                for (var c = 0; c < ids.length; c++) {
                    if (c + 1 == ids.length) {
                        query += ids[c];
                    } else {
                        query += ids[c] + ',';
                    }
                }
                query += ') Where not(has(node.isDeleted)) return node';
                context.executeQuery(query, {}).then(function(results) {
                    resolve(results);
                }, function(error) {
                    reject(error)
                });
            } else {
                resolve([]);
            }
        });
    },
    buildStartStatement:function(ids){
      var query = 'START node=node(';
      for (var c = 0; c < ids.length; c++) {
          if (c + 1 == ids.length) {
              query += ids[c];
          } else {
              query += ids[c] + ',';
          }
      }
      query += ')';
      return query
    },
    createNode: function(data, label) {
        var context = this;
        return new rsvp.Promise(function(resolve, reject) {
            var query = 'CREATE (node:' + label + ' {data}) RETURN node';
            var params = {
                data: data
            }
            context.executeQuery(query, params).then(function(results) {
                resolve(results);
            }, function(err) {
                reject(err);
            })
        })
    },
    updateNode: function(id, data) {
        var context = this;
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
            console.log(query)
            context.executeQuery(query, params).then(function(results) {
                console.log('done')
                resolve(results);
            }, function(error) {
                reject(error);
            });
        })
    },
    createRelationShip: function(source, target, label) {
        var query = [
            'START source=node(' + source + '),target=node(' + target + ')',
            'CREATE source-[r:' + label + ']->target',
            'RETURN source'
        ].join('\n');
        return this.executeQuery(query, {});
    },
    deleteEntity: function(id) {
        var query = ['START n=node(' + id + ')',
            'SET n.isDeleted = true',
            'RETURN n'
        ];
        return this.executeQuery(query.join('\n'), {});
    },
    executeQuery: function(query, variableHash) {
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
