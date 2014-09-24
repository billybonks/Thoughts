var controller = require('./Controller.js');
var Promise = require('./../lib/promise')
var error = require('./../lib/Errors.js').reject;
var model = require('./../models/configuration')();
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
  ConfigurationController.prototype.getConfiguration = function(ids) {
    return Promise.call(this, function(resolve, reject) {
      var ret = {};
      var context = this;
      var counter = 0;
      for (var i = 0; i < ids.length; i++) {
        var query = ['Start node=node(' + ids[i] + ')',
          'Match node-[c:Configures]->configures',
          'Match node-[f:Targets]->for',
          'Return configures,node,for'
        ];
        this.executeQueryRSVP(query.join('\n'), {}).then(function(results) {
          for (var i = 0; i < results.length; i++) {
            var configuration = new model();
            configuration.parse(results[i]);
            ret[configuration.get('id')] = configuration.getJSON();
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
  ConfigurationController.prototype.getCardConfigurations = function(cardId) {
    return Promise.call(this, function(resolve, reject) {
      var context = this;
      var query = ['Start configures=node(' + cardId + ')',
        'Match node-[c:Configures]->configures',
        'Match node-[f:Targets]->for',
        'Return configures,node,for'
      ];
      this.executeQueryRSVP(query.join('\n'), {}).then(function(results) {
        var configurations = {}
        for (var i = 0; i < results.length; i++) {
          var configuration = new model();
          configuration.parse(results[i]);
          configurations[configuration.get('id')] = configuration.getJSON();
        }
        console.log('resolving')
        console.log(configurations)
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

  ConfigurationController.prototype.createCardConfiguartion = function(configuration) {
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
  }

  /**
   * Creates configuration node.
   * @param {id} String Configuration id to be updated
   * @param {data} Object Updated values
   * @return
   */
  ConfigurationController.prototype.updateConfiguration = function(id, data) {
    return Promise.call(this, function(resolve, reject) {
      var query = ['START configuration=node(' + id + ')',
        'SET configuration.embedded = {embedded},',
        'configuration.position = {position}',
        'RETURN configuration'
      ];
      var variableHash = data;
      this.executeQueryRSVP(query.join('\n'), data).then(function(data) {
        resolve(data);
      }, error(reject))
    });
  }

  return new ConfigurationController();
}
