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
  function TagsController(){
  }
  TagsController.prototype = new controller();
  /* ========================================================================================================
   *
   * Helper Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  TagsController.prototype.GetTags=function(ids){
    var returnSream = new Stream();
    var context = this;
    this.GetNodes(ids).on('data',function(results){
      var ret = []
      for(var i =0;i<results.length;i++){
        ret.push(context.FormatObject(results[i].n));
      }
      returnSream.emit('data',ret);
    }).on('error',function(error){
      ErrorHandler.Handle500(emitter,'GetCardConfiguration',error);
    });
    return returnSream;
  }

  TagsController.prototype.FindOrCreate=function(names){
    var returnStream = new Stream();
    var query = ['Match (tag:Tag)']
    var variableHash = {}
    var nameDictionary = {}
    var context = this;
    for(var i =0;i<names.length;i++){
      nameDictionary[names[i]] = null;
      var varname = 'tag'+i;
      variableHash[varname] = names[i];
      var where
      if(i === 0){
        where = 'Where ';
      }else{
        where = 'Or ';
      }
      where +=  'tag.title = {'+varname+'}';
      query.push(where);
    }
    query.push('return tag');
    this.executeQuery(query.join('\n'),variableHash)
    .on('data',function(results){
      var createCounter = 0;
      var returnCounter = 0;
      console.log(results);
      for(var i = 0; i<results.length;i++){
        var rTag = results[i].tag;
        console.log(rTag);
        nameDictionary[rTag.data.title] = context.FormatObject(rTag);
      }
      for(var key in nameDictionary){
        if(nameDictionary[key] == null){
          createCounter++;
          context.CreateTag.call(context,key,'Add Description')
          .on('data',function(result){
            nameDictionary[result[0].tag.data.title] = context.FormatObject(result[0].tag);
            returnCounter++;
            if(returnCounter === createCounter){
              returnStream.emit('data',nameDictionary);
            }
          })
        }
      }
      if(createCounter === returnCounter){
        returnStream.emit('data',nameDictionary);
      }
    })
    return returnStream;
  };

  TagsController.prototype.TagEntity=function(tags,entityId){
    var returnStream = new Stream();
    if(tags.length >=1){
      var tagEntityRelationShip =  [];
      var temp = 'START tag=node('
      for(var i =0;i<tags.length;i++){
        temp += tags[i]
        if(i<tags.length-1){
          temp+=',';
        }
      }
      temp+= ')';
      temp+=', entity=node('+entityId+')';
      tagEntityRelationShip.push(temp);
      tagEntityRelationShip.push('CREATE tag-[r:Tagged]->entity');
      tagEntityRelationShip.push('return tag');
      this.executeQuery(tagEntityRelationShip.join('\n'),{})
      .on('data',function(results){
        returnStream.emit('data',results);
      })
    }else{
      setTimeout(function() {
        returnStream.emit('data',[]);
      }, 100,returnStream);
    }
    return returnStream;
  }
  /*
            'START tags=node('+id+')',
      'MATCH (user:Person)',
      'WHERE user.session_token = {token}',
      'CREATE user-[r:Created]->entity',
      'RETURN user,entity'
      */
  TagsController.prototype.CreateTag=function(title,description){
    var createTagQuery = 'CREATE (tag:Tag {data}) RETURN tag';
    var newTagHash = {data:{title:title,description:description}};
    return this.executeQuery(createTagQuery,newTagHash);
  };

  TagsController.prototype.FormatObject = function(tag){
    return {
      id:tag.id,
      title:tag.data.title,
      description:tag.data.description
    }
  }
  return new TagsController();
};