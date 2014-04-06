var Stream = require('stream');
var neo4j = require('neo4j-js');
var controller = require('./Controller.js');

module.exports = function(){
  'use strict';
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function ConfigurationController(){
  }

  ConfigurationController.prototype = new controller();

  ConfigurationController.prototype.GetConfiguration=function(ids){
    var returnStream = new Stream();
    var ret = [];
    var context = this;
    var counter = 0;
    for(var i = 0; i<ids.length;i++){
      var query = ['Start configuration=node('+ids[i]+')',
                   'Match configuration-[c:Configured]->card',
                   'Match configuration-[f:For]->target',
                   'Return card,configuration,target'
                  ];
      console.log('executer')
      this.executeQuery(query.join('\n'),{})
      .on('data',function(results){
        console.log('Got REzzz')
        for(var i = 0;i<results.length;i++){
          ret.push(context.FormatNeo4jObject(results[i]))
        }
        counter++;
        console.log(counter+'=='+ids.length)
        if(counter === ids.length){
          returnStream.emit('data',ret);
        }
      })
    }
    return returnStream;
  }

  ConfigurationController.prototype.GetCardConfigurations=function(cardId){
    var returnStream = new Stream();
    var context = this;
    var query = ['Start card=node('+cardId+')',
                 'Match configuration-[c:Configured]->card',
                 'Match configuration-[f:For]->target',
                 'Return card,configuration,target'
                ];
    this.executeQuery(query.join('\n'),{})
    .on('data',function(results){
      var configurations =[]
      for(var i = 0;i<results.length;i++){
        configurations.push(context.FormatNeo4jObject(results[i]))
      }
      console.log(configurations);
      returnStream.emit('data',configurations)
    })
    return returnStream;
  }

  ConfigurationController.prototype.CreateCardConfiguartion=function(target,bindingCard){

  }

  ConfigurationController.prototype.CreateCardConfiguartion=function(targetId,bindingCardId,configuration){
    var responseStream = new Stream();
    var context = this;
    this.CreateConfiguartionNode(configuration)
    .on('data',function(data){
      console.log('config node created');
      var configNodeId = data[0].config.id;
      context.LinkConfigurationTarget.call(context,targetId,configNodeId)
      .on('data',function(data){
        console.log('LinkConfigurationTarget');
        context.LinkConfigurationFor.call(context,bindingCardId,configNodeId)
        .on('data',function(data){
          console.log('LinkConfigurationFor');
          console.log(data);
          responseStream.emit('data',data);
        })
      })
    })
  }

  ConfigurationController.prototype.UpdateConfiguration=function(id,data){
  var query = ['START configuration=node('+id+')',
               'SET configuration.embedded = {embedded},',
               'configuration.position = {position}',
               'RETURN configuration'];
    var variableHash = data;
    return this.executeQuery(query.join('\n'),variableHash)
  }

  ConfigurationController.prototype.CreateConfiguartionNode=function(configuration){
    var query = 'CREATE (config:Configuration {data}) RETURN config';
    var variableHash = {data:configuration};
    return this.executeQuery(query,variableHash)
  }

  ConfigurationController.prototype.LinkConfigurationTarget=function(targetId,configNodeId){
    var configurationCardRelationShip =  [
      'START config=node('+configNodeId+'), target=node('+targetId+')',,
      'CREATE config-[r:Configured]->target',
      'RETURN config,target'
    ];
    return this.executeQuery(configurationCardRelationShip.join('\n'),{})
  }

  ConfigurationController.prototype.LinkConfigurationFor=function(bindingCard,configNodeId){
    var configurationCardRelationShip =  [
      'START config=node('+configNodeId+'), target=node('+bindingCard+')',,
      'CREATE config-[r:For]->target',
      'RETURN config,target'
    ];
    return this.executeQuery(configurationCardRelationShip.join('\n'),{})
  }

  ConfigurationController.prototype.FormatNeo4jObject=function(data){
    var target = data.card.id;
    var f = data.target.id
    var config = data.configuration
    return this.FormatObject(config,target,f);
  }

  ConfigurationController.prototype.FormatObject=function(data,target,f){
    return {
      id:data.id,
      position:data.data.position,
      'for':f,
      embedded:data.data.embedded,
      configures:target
    }
  }

  return new ConfigurationController();
}