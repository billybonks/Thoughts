var controller = require('./Controller.js');
var Promise = require('./../lib/promise')
var error = require('./../lib/Errors.js').reject;
module.exports = function() {
    'use strict';
    /* ========================================================================================================
     *
     * Class Setup - Keep in alphabetical order
     *
     * ===================================================================================================== */
    function ConfigurationController() {}

    ConfigurationController.prototype = new controller();

    /**
     * Gets configuration objects based on specified ids
     * @param {ids} Array configuration id
     * @return
     */
    ConfigurationController.prototype.GetConfiguration = function(ids) {
        return Promise.call(this, function(resolve, reject) {
            var ret = {};
            var context = this;
            var counter = 0;
            for (var i = 0; i < ids.length; i++) {
                var query = ['Start configuration=node(' + ids[i] + ')',
                    'Match configuration-[c:Configures]->card',
                    'Match configuration-[f:Targets]->target',
                    'Return card,configuration,target'
                ];
                this.executeQueryRSVP(query.join('\n'), {}).then(function(results) {
                    for (var i = 0; i < results.length; i++) {
                        var config = context.FormatNeo4jObject(results[i]);
                        ret[config.id] = config;
                    }
                    counter++;
                    if (counter === ids.length) {
                        resolve(ret);
                    }
                }, error(reject));
            }
        });
    }

    /**
     * Gets configuration objects based on card id
     * @param {cardId} Object cardId
     * @return
     */
    ConfigurationController.prototype.GetCardConfigurations = function(cardId) {
        return Promise.call(this, function(resolve, reject) {
            var context = this;
            var query = ['Start card=node(' + cardId + ')',
                'Match configuration-[c:Configures]->card',
                'Match configuration-[f:Targets]->target',
                'Return card,configuration,target'
            ];
            this.executeQueryRSVP(query.join('\n'), {}).then(function(results) {
                var configurations = {}
                for (var i = 0; i < results.length; i++) {
                    var config = context.FormatNeo4jObject(results[i]);
                    configurations[config.id] = config;
                }
                resolve(configurations)
            }, error(reject));
        });
    }

    /**
     * Creates configuration node.
     * @param {targetId} String Target being configured
     * @param {bindingCardId} String Card context when configuration applies
     * @param {configuration} Object Configuration data
     * @return
     */

    ConfigurationController.prototype.CreateCardConfiguartion = function(targetId, bindingCardId, configuration) {
        return Promise.call(this, function(resolve, reject) {
            var context = this;
              this.createNode(configuration,'Configuration').then(function(data){
                var configNodeId = data[0].node.id;
                context.createRelationShip.call(context, configNodeId, targetId, 'Configures').then(function() {
                    context.createRelationShip.call(context, configNodeId, bindingCardId, 'Targets').then(function() {
                        resolve(data);
                    }, error(reject))
                }, error(reject))
            }, error(reject));
        });
    }
//  this.CreateConfiguartionNode(configuration).then(function(data) {
    /**
     * Creates configuration node.
     * @param {id} String Configuration id to be updated
     * @param {data} Object Updated values
     * @return
     */
    ConfigurationController.prototype.UpdateConfiguration = function(id, data) {
        return Promise.call(this, function(resolve, reject) {
            var query = ['START configuration=node(' + id + ')',
                'SET configuration.embedded = {embedded},',
                'configuration.position = {position}',
                'RETURN configuration'
            ];
            console.log(data);
            var variableHash = data;
            this.executeQueryRSVP(query.join('\n'), data).then(function(data) {
                resolve(data);
            }, error(reject))
        });
    }

    ConfigurationController.prototype.CreateConfiguartionNode = function(configuration) {
        return Promise.call(this, function(resolve, reject) {
            var query = 'CREATE (config:Configuration {data}) RETURN config';
            var variableHash = {
                data: configuration
            };
            this.executeQueryRSVP(query, variableHash).then(function(data) {
                resolve(data)
            }, error(reject))
        });
    }

    ConfigurationController.prototype.FormatNeo4jObject = function(data) {
        var target = data.card.id;
        var f = data.target.id
        var config = data.configuration
        return this.FormatObject(config, target, f);
    }

    ConfigurationController.prototype.FormatObject = function(data, target, f) {
        return {
            id: data.id,
            position: data.data.position,
            'for': f,
            embedded: data.data.embedded,
            configures: target
        }
    }

    return new ConfigurationController();
}
