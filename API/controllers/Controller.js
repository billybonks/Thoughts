var Stream = require('stream');
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
    function Controller() {}
    /* ========================================================================================================
     *
     * Helper Methods - Keep in alphabetical order
     *
     * ===================================================================================================== */
    Controller.prototype.buildStartStatement = function(ids, varname) {
        var query = 'START ' + varname + '=node(';
        for (var c = 0; c < ids.length; c++) {
            if (c + 1 == ids.length) {
                query += ids[c];
            } else {
                query += ids[c] + ',';
            }
        }
        return query + ')';
    };

    Controller.prototype.getNodes = function(ids) {
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
        return this.executeQueryRSVP(query, {});
    }


    Controller.prototype.deleteEntity = function(id) {
        var query = ['START n=node(' + id + ')',
            'SET n.isDeleted = true',
            'RETURN n'
        ];
        return this.executeQueryRSVP(query.join('\n'), {});
    };

    Controller.prototype.executeQuery = function(query, variableHash) {
        var queryStream = new Stream();
        neo4j.connect(nconf.get('database'), function(err, graph, done) {
            graph.query(query, variableHash, function(err, results) {
                if (err) {
                    queryStream.emit('error', {
                        type: 'queryError',
                        innerException: err
                    });

                } else {
                    queryStream.emit('data', results);
                }
            });
        });
        return queryStream;
    };

    Controller.prototype.executeQueryRSVP = function(query, variableHash) {
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

    return new Controller();
};
