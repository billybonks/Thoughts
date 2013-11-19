//require staements
var ServiceModule = require('./ServiceModule.js')
var Stream = require('stream');

module.exports = function(settings){

  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function Tag(settings){

    this.cache = [];
  }

  Tag.prototype = new ServiceModule(settings);

  /* ========================================================================================================
   *
   * Read Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

  Tag.prototype.TagExists= function (title){
    if(title in this.cache){
      return true;
    }else{
      return false;
    }
  }
  Tag.prototype.GetTags=function(ids){
    var responseStream = new Stream();
    this.GetNodes(ids);
    this.once('GetNodes.done',function(results){
      var ret = [];
      for(var i =0;i<results.length;i++){
        var tag = {
          id : results[0].n.id,
          title:results[0].n.data.title,
          description :results[0].n.data.description
        }
        ret.push(tag);
      }
      responseStream.emit('data',ret);
    })
    return responseStream;
  }
  //returns all tags if no tags pressent
  Tag.prototype.PrepareCache= function (tags){
    //match (n:Card) where n.title='QWerty' OR n.title='asdasd' return n
    var resultStream = new Stream()
    var query =  [];
    var cache = this.cache;
    query.push('match (n:Tag)')

    for(var i =0;i<tags.length;i++){
      if(!tags[i] in cache){
        if(i==0){
          query.push('where n.title="'+tags[i]+'"')
        }else{
          query.push('or n.title="'+tags[i]+'"')
        }
      }
    }
    query.push('return n');
    console.log(query.join('\n'))
    var queryStream = settings.executeQuery(query.join('\n'),{});
    queryStream.on('data',function(results){
      for(var i = 0;i < results.length;i++){
        cache[results[i].n.data.title] = results[i].n;
      }
      resultStream.emit('data',null);
    });
    return resultStream;
  }
  /* ========================================================================================================
   *
   * Write Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  Tag.prototype.CreateAndTagEntity=function (title,description,targetId){
    var resultStream = new Stream();
    var createTagQuery = 'CREATE (n:Tag {data}) RETURN n';
    var newTagHash = {data:{title:title,description:description}};
    var queryStream = settings.executeQuery(createTagQuery,newTagHash);
    var tag = this.TagBase;
    console.log(tag)
    queryStream.on('data',function(results){
      var tagObj = results[0].n.data;
      console.log(results);
      console.log(tagObj);
      var tagId = results[0].n.id;
      console.log(tag)
      var tagStream = tag(targetId,tagId);
      tagStream.on('data',function(results){
        resultStream.emit('data',results);
      })
    });
    return resultStream;
  }

  Tag.prototype.TagBase=function(nodeId,tagId){
    var responseStream = new Stream();
    var query =  [
      'START n=node('+nodeId+'),t=node('+tagId+')',
      'CREATE t-[r:Tagged]->n',
      'RETURN t'
    ];
    var resultStream = settings.executeQuery(query.join('\n'),{});
    resultStream.on('data', function (results) {
      console.log(results)
      responseStream.emit('data',results[0].t.data)
    });
    return responseStream;
  }

  Tag.prototype.TagEntity=function (nodeId,tags){
    var cacheStream = this.PrepareCache(tags)
    var cache = this.cache;
    var TagBase = this.TagBase;
    var Create = this.CreateAndTagEntity;
    var context = this;
    var emitter = this;
    console.log('tagging')
    cacheStream.on('data',function(results){
      var count = tags.length;
      var counter = 0
      for(var i = 0; i < tags.length;i++){
        console.log(tags[i] in cache);
        if(tags[i] in cache){
          console.log('retag');
          var result = TagBase.call(context,nodeId,cache[tags[i]].id)
          console.log(result)
          result.on('data',function(results){
            counter++;
            console.log('counter = '+counter)
            if(counter == count){
              console.log('done')
              emitter.emit('TagEntity.done',{});
            }
          })
        }else{
          console.log('newTag');
          var result = Create.call(context,tags[i],'',nodeId)
          result.on('data',function(results){
            counter++;
            console.log('counter = '+counter)
            if(counter == count){
              console.log('done')
              emitter.emit('TagEntity.done',{});
            }
          })

        }
      }
    });
  }


  return new Tag(settings);
}