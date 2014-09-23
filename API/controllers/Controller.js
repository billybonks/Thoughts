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

    Controller.prototype.createRelationShip = function(source, target, label) {
        var query = [
            'START source=node(' + source + '),target=node(' + target + ')',
            'CREATE source-[r:' + label + ']->target',
            'RETURN source'
        ].join('\n');
        return this.executeQuery(query, {});
    }


    Controller.prototype.deleteEntity = function(id) {
        var responseStream = new Stream();
        var query = ['START n=node(' + id + ')',
            'SET n.isDeleted = true',
            'RETURN n'
        ];
        return this.executeQuery(query.join('\n'), {});
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
            console.log('execing QQ')
            neo4j.connect(nconf.get('database'), function(err, graph, done) {
                graph.query(query, variableHash, function(err, results) {
                    if (err) {
                        console.log('qq error')
                        reject({
                            type: 'queryError',
                            innerException: err
                        });
                    } else {
                        console.log('resolving qq')
                        resolve(results);
                    }
                });
            });
        });
    };

    return new Controller();
};
