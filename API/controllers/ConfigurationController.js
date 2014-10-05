'use strict';
var Controller = require('./controller.js');
var Promise = require('./../lib/promise');
var error = require('./../lib/Errors.js').reject;
var model = require('./../models/configuration');

module.exports = Controller.extend({
    /**
     * Gets configuration objects based on specified ids
     * @param {ids} Array configuration id
     * @return
     */
    getConfiguration: function(ids) {
        return Promise.call(this, function(resolve, reject) {
            var ret = [];
            var context = this;
            var counter = 0;
            for (var i = 0; i < ids.length; i++) {
                var query = ['Start node=node(' + ids[i] + ')',
                    'Match node-[c:Configures]->configures',
                    'Match node-[f:Targets]->for',
                    'Return configures,node,for'
                ];
                this.executeQuery(query.join('\n'), {}).then(function(results) {
                    for (var i = 0; i < results.length; i++) {
                        var configuration = new model();
                        configuration.parse(results[i]);
                        ret.push(configuration);
                    }
                    counter++;
                    if (counter === ids.length) {
                        resolve(ret);
                    }
                }, error(reject));
            }
        });
    },
    /**
     * Gets configuration objects based on card id
     * @param {cardId} Object cardId
     * @return
     */
    getCardConfigurations: function(cardId) {
        return Promise.call(this, function(resolve, reject) {
            var context = this;
            var query = ['Start configures=node(' + cardId + ')',
                'Match node-[c:Configures]->configures',
                'Match node-[f:Targets]->for',
                'Return configures,node,for'
            ];
            this.executeQuery(query.join('\n'), {}).then(function(results) {
                var configurations = [];
                for (var i = 0; i < results.length; i++) {
                    var configuration = new model();
                    configuration.parse(results[i])
                    configurations.push(configuration);
                }
                resolve(configurations)
            }, error(reject));
        });
    },
    /**
     * Creates configuration node.
     * @param {configuration} Object Configuration data
     * @return
     */
    createCardConfiguartion: function(configuration) {
        return Promise.call(this, function(resolve, reject) {
            var context = this;
            this.createNode(configuration.getVectorData(), 'Configuration').then(function(data) {
                configuration.parse(data[0]);
                context.createRelationShip(configuration.get('id'), configuration.get('configures'), 'Configures').then(function() {
                    context.createRelationShip(configuration.get('id'), configuration.get('for'), 'Targets').then(function() {
                        resolve(configuration);
                    }, error(reject))
                }, error(reject))
            }, error(reject));
        });
    },
    /**
     * Creates configuration node.
     * @param {id} String Configuration id to be updated
     * @param {data} Object Updated values
     * @return
     */
    updateConfiguration: function(configuration) {
        return Promise.call(this, function(resolve, reject) {
            this.updateNode(configuration.get('id'), configuration.getVectorData()).then(function(results) {
                configuration.parse(results[0]);
                resolve(configuration)
            })
        });
    }
});
