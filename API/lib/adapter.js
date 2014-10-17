var neo4j = require('neo4j-js');
var nconf = require('nconf');
var rsvp = require('rsvp');

module.exports = function() {
    'use strict';
    /* ========================================================================================================
     *
     * Class Setup - Keep in alphabetical order
     *
     * ===================================================================================================== */
    function Adapter() {}
    /* ========================================================================================================
     *
     * Helper Methods - Keep in alphabetical order
     *
     * ===================================================================================================== */

    Adapter.prototype.getAll = function(ids) {
        var context = this;
        return new rsvp.Promise(function(resolve, reject) {
            if (ids) {
                var query = 'START n=node(';
                for (var c = 0; c < ids.length; c++) {
                    if (c + 1 == ids.length) {
                        query += ids[c];
                    } else {
                        query += ids[c] + ',';
                    }
                }
                query += ') Where not(has(n.isDeleted)) return n';
                context.executeQueryRSVP(query, {}).then(function(results) {
                    resolve(results);
                }, function(error) {
                    reject(error)
                });
            } else {
                resolve([]);
            }
        });
    };

    Adapter.prototype.create = function(data, label) {
        var context = this;
        console.log(this)
        return new rsvp.Promise(function(resolve, reject) {
            var query = 'CREATE (node:' + label + ' {data}) RETURN node';
            var params = {
                data: data
            }
            context.executeQueryRSVP(query, params).then(function(results) {
                resolve(results);
            }, function(err) {
                reject(err);
            })
        })
    }

    Adapter.prototype.update = function(id, data) {
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

    Adapter.prototype._createRelationShip = function(source, target, label) {
        var query = [
            'START source=node(' + source + '),target=node(' + target + ')',
            'CREATE source-[r:' + label + ']->target',
            'RETURN source'
        ].join('\n');
        return this.executeQueryRSVP(query, {});
    }


    Adapter.prototype.delete = function(id) {
        var query = ['START n=node(' + id + ')',
            'SET n.isDeleted = true',
            'RETURN n'
        ];
        return this.executeQueryRSVP(query.join('\n'), {});
    };

    Adapter.prototype.executeQuery = function(query, variableHash) {
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
    };

    return new Adapter();
};
