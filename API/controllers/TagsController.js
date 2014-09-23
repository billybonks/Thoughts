var controller = require('./Controller.js');
var error = require('./../lib/Errors.js').reject;
var Promise = require('./../lib/promise')
var Tag = require('./../models/tag')();
module.exports = function() {
  'use strict';
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function TagsController() {}

  TagsController.prototype = new controller();
  /* ========================================================================================================
   *
   * Helper Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  TagsController.prototype.GetTags = function(ids) {
    return Promise.call(this, function(resolve, reject) {
      this.getNodes(ids).then(function(results) {
        var ret = []
        for (var i = 0; i < results.length; i++) {
          ret.push(Tag.parse(results[i].n));
        }
        resolve(ret);
      }, error(reject))
    });
  }

  TagsController.prototype._findByNames = function(names) {
    var nameDictionary = {}
    return Promise.call(this, function(resolve, reject) {
      var query = ['Match (tag:Tag)']
      var variableHash = {}
      for (var i = 0; i < names.length; i++) {
        nameDictionary[names[i]] = null;
        var varname = 'tag' + i;
        variableHash[varname] = names[i];
        var where
        if (i === 0) {
          where = 'Where ';
        } else {
          where = 'Or ';
        }
        where += 'tag.title = {' + varname + '}';
        query.push(where);
      }
      query.push('return tag');
      this.executeQueryRSVP(query.join('\n'), variableHash).then(function(results) {
        for (var i = 0; i < results.length; i++) {
          var rTag = results[i].tag;
          nameDictionary[rTag.data.title] = Tag.parse(rTag);
        }
        resolve(nameDictionary);
      }, error(reject));
    });
  }

  //TODO will the 2nd resolve ever get hit
  TagsController.prototype.FindOrCreate = function(names) {
    var context = this;
    return Promise.call(this, function(resolve, reject) {
      this._findByNames(names).then(function(nameDictionary) {
        var createCounter = 0;
        var returnCounter = 0;
        for (var key in nameDictionary) {
          if (!nameDictionary[key]) {
            createCounter++;
            context._createTag.call(context, key, 'Add Description').then(function(tag) {
              console.log('returned')
              nameDictionary[tag.title] = tag
              returnCounter++;
              console.log(createCounter +' == '+returnCounter)
              if (returnCounter === createCounter) {
                console.log('resolve1')
                console.log(nameDictionary);
                resolve(nameDictionary);
              }
            }, error(reject))
          }
        }
        //if no tags to be created
        if (createCounter === returnCounter) {
          console.log('resolve2')
          console.log(nameDictionary);
          resolve(nameDictionary);
        }
      }, error(reject));
    });
  };

  TagsController.prototype.TagEntity = function(tags, entityId) {
    return Promise.call(this, function(resolve, reject) {
      if (tags.length >= 1) {
        var tagEntityRelationShip = [];
        var temp = 'START tag=node('
        for (var i = 0; i < tags.length; i++) {
          temp += tags[i]
          if (i < tags.length - 1) {
            temp += ',';
          }
        }
        temp += ')';
        temp += ', entity=node(' + entityId + ')';
        tagEntityRelationShip.push(temp);
        tagEntityRelationShip.push('CREATE tag-[r:Tagged]->entity');
        tagEntityRelationShip.push('return tag');
        this.executeQueryRSVP(tagEntityRelationShip.join('\n'), {})
          .then(function(results) {
            resolve(results);
          }, error(reject));
      } else {
        resolve([]);
      }
    });
  }

  TagsController.prototype._createTag = function(title, description) {
    console.log(this)
    console.log('creting tag')
    return Promise.call(this, function(resolve, reject) {
      console.log('preping query')
      var createTagQuery = 'CREATE (tag:Tag {data}) RETURN tag';
      var newTagHash = {
        data: {
          title: title,
          description: description,
          date_created: Date.now(),
          date_modified: Date.now()
        }
      };

      this.executeQueryRSVP(createTagQuery, newTagHash).then(function(result) {
        console.log('tag created')
        resolve(Tag.parse(result[0].tag));
      }, error(reject))

    });
  };

  return new TagsController();
};

/*
 */
