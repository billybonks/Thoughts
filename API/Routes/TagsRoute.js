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

  Tag.prototype.PrepareCache= function (tags){
    //match (n:Card) where n.title='QWerty' OR n.title='asdasd' return n
    var query =  [];
    var cache = this.cache;
    query.push('match (n:Tag)')
    for(var i =0;i<tags.length;i++){
      if(i==0){
        query.push('where n.title="'+tags[i]+'"')
      }else{
        query.push('or n.title="'+tags[i]+'"')
      }
    }
    query.push('return n');
    console.log(query.join('\n'))
    var queryStream = settings.executeQuery(query.join('\n'),{});
    queryStream.on('data',function(results){
        console.log('resulted')
        for(var i = 0;i < results.length;i++){
          console.log(results[i])
          console.log(cache);
          cache[results[i].n.data.title] = results[i].n;
        }
    })
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
      responseStream.emit(results[0].t.data)
    });
    return responseStream;
  }

  Tag.prototype.TagEntity=function (nodeId,tags){
    this.PrepareCache(tags)
    var resultStream = new Stream();
    var count = tags.length;
    var counter = 0
    for(var i = 0; i < tags.length;i++){
      if(!this.TagExists(tags[i])){
        var result = this.CreateAndTagEntity(tags[i],'',nodeId)
        result.on('data',function(results){
          counter++;
          console.log(counter);
          if(counter == count){
            resultStream.emit('data',null);
          }
        })
      }else{
        this.TagBase(nodeId,this.cache[tags[i]].id)
      }
    }
    return resultStream;
  }

  return new Tag(settings);
}