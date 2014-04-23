var Stream = require('stream');
var neo4j = require('neo4j-js');
var controller = require('./Controller.js');
var ErrorHandler = require('./../lib/Errors.js');

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
    var ret = {};
    var context = this;
    var counter = 0;
    for(var i = 0; i<ids.length;i++){
      var query = ['Start configuration=node('+ids[i]+')',
                   'Match configuration-[c:Configures]->card',
                   'Match configuration-[f:Targets]->target',
                   'Return card,configuration,target'
                  ];
      this.executeQuery(query.join('\n'),{})
      .on('data',function(results){
        for(var i = 0;i<results.length;i++){
          var config = context.FormatNeo4jObject(results[i]);
          ret[config.id]=config;
        }
        counter++;
        // console.log(counter+'=='+ids.length)
        if(counter === ids.length){
          returnStream.emit('data',ret);
        }
      }).on('error',function(error){
        ErrorHandler.Handle500(emitter,'GetConfiguration',error);
      });
    }
    return returnStream;
  }

  ConfigurationController.prototype.GetCardConfigurations=function(cardId){
    var returnStream = new Stream();
    var context = this;
    var query = ['Start card=node('+cardId+')',
                 'Match configuration-[c:Configures]->card',
                 'Match configuration-[f:Targets]->target',
                 'Return card,configuration,target'
                ];
    this.executeQuery(query.join('\n'),{})
    .on('data',function(results){
      var configurations ={}
      for(var i = 0;i<results.length;i++){
        var config = context.FormatNeo4jObject(results[i]);
        configurations[config.id]=config;
      }
      //  console.log('awadads')
      //  console.log(configurations)
      returnStream.emit('data',configurations)
    }).on('error',function(error){
      ErrorHandler.Handle500(emitter,'GetCardConfiguration',error);
    });
    return returnStream;
  }

  ConfigurationController.prototype.CreateCardConfiguartion=function(target,bindingCard){

  }

  ConfigurationController.prototype.CreateCardConfiguartion=function(targetId,bindingCardId,configuration){
    var responseStream = new Stream();
    var context = this;
    this.CreateConfiguartionNode(configuration)
    .on('data',function(data){
      var configNodeId = data[0].config.id;
      context.LinkConfigurationTarget.call(context,targetId,configNodeId)
      .on('data',function(data){
        context.LinkConfigurationFor.call(context,bindingCardId,configNodeId)
        .on('data',function(data){
          responseStream.emit('data',data);
        }).on('error',function(error){
          responseStream.emit('error',error);
        });
      }).on('error',function(error){
        responseStream.emit('error',error);
      });
    }).on('error',function(error){
      responseStream.emit('error',error);
    });
    return responseStream;
  }


  ConfigurationController.prototype.UpdateConfiguration=function(id,data){
    var responseStream = new Stream();
    var query = ['START configuration=node('+id+')',
                 'SET configuration.embedded = {embedded},',
                 'configuration.position = {position}',
                 'RETURN configuration'];
    var variableHash = data;
    ErrorHandler.HandleResponse(this.executeQuery(query.join('\n'),variableHash),responseStream,'UpdateConfiguration');
    return responseStream;
  }

  ConfigurationController.prototype.CreateConfiguartionNode=function(configuration){
    var responseStream = new Stream();
    var query = 'CREATE (config:Configuration {data}) RETURN config';
    var variableHash = {data:configuration};
    return this.executeQuery(query,variableHash)
    ErrorHandler.HandleResponse(this.executeQuery(query.join('\n'),variableHash),responseStream,'CreateConfiguartionNode');
    return responseStream;
  }

  ConfigurationController.prototype.LinkConfigurationTarget=function(targetId,configNodeId){
    var responseStream = new Stream();
    var configurationCardRelationShip =  [
      'START config=node('+configNodeId+'), target=node('+targetId+')',,
      'CREATE config-[r:Configures]->target',
      'RETURN config,target'
    ];
    ErrorHandler.HandleResponse(this.executeQuery(configurationCardRelationShip.join('\n'),{}),responseStream,'CreateConfiguartionNode');
    return responseStream;
  }

  ConfigurationController.prototype.LinkConfigurationFor=function(bindingCard,configNodeId){
    var responseStream = new Stream();
    var configurationCardRelationShip =  [
      'START config=node('+configNodeId+'), target=node('+bindingCard+')',,
      'CREATE config-[r:Targets]->target',
      'RETURN config,target'
    ];
    ErrorHandler.HandleResponse(this.executeQuery(configurationCardRelationShip.join('\n'),{}),responseStream,'CreateConfiguartionNode');
    return responseStream
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