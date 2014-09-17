var Stream = require('stream');
var neo4j = require('neo4j-js');
var controller = require('./Controller.js');
var ErrorHandler = require('./../lib/Errors.js');
var rsvp = require('rsvp');
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
    var context = this;
    return new rsvp.Promise(function(resolve, reject) {
      console.log('gEtting Nodes')
      context.GetNodes(ids).then(function(results) {
        console.log('Got Em Nodes')
        var ret = []
        for (var i = 0; i < results.length; i++) {
          ret.push(context.FormatObject(results[i].n));
        }
        resolve(ret);
      }, function(error) {
        console.log('ERRORRS')
        reject(error);
      })
    });
  }

  TagsController.prototype._findByNames = function(names) {
    var query = ['Match (tag:Tag)']
    var variableHash = {}
    for (var i = 0; i < names.length; i++) {
      //nameDictionary[names[i]] = null;
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
    return this.executeQueryRSVP(query.join('\n'), variableHash);
  }

  TagsController.prototype.FindOrCreate = function(names) {
    var context = this;
    return new rsvp.Promise(function(resolve, reject) {
      context._findByNames(names).then(function(results) {
        var nameDictionary = {}
        console.log('gOttage')
        var createCounter = 0;
        var returnCounter = 0;
        console.log(results);
        for (var i = 0; i < results.length; i++) {
          var rTag = results[i].tag;
          console.log(rTag);
          nameDictionary[rTag.data.title] = context.FormatObject(rTag);
        }
        for (var key in names) {
          var name = names[key];
          if (!nameDictionary[name]) {
            createCounter++;
            context.CreateTag.call(context, name, 'Add Description').then(function(result) {
              nameDictionary[result[0].tag.data.title] = context.FormatObject(result[0].tag);
              returnCounter++;
              if (returnCounter === createCounter) {
                console.log('Resolvage')
                resolve(nameDictionary);
              }
            })
          }
        }
        if (createCounter === returnCounter) {
          console.log('ResolveAge 2')
          resolve(nameDictionary);
        }
      },function(error){reject(error)});
    });
  };

  //BOUND TO CARD CONTROLLER AND ROUTE
  TagsController.prototype.TagEntity = function(tags, entityId) {
    var context = this;
    return new rsvp.Promise(function(resolve, reject) {
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
          }, function(error) {
            reject(error)
          });

      } else {
        resolve([]);
      }
    });
  }

  TagsController.prototype.CreateTag = function(title, description) {
    var createTagQuery = 'CREATE (tag:Tag {data}) RETURN tag';
    var newTagHash = {
      data: {
        title: title,
        description: description,
        date_created: Date.now(),
        date_modified: Date.now()
      }
    };
    return this.executeQueryRSVP(createTagQuery, newTagHash);
  };

  TagsController.prototype.FormatObject = function(tag) {
    return {
      id: tag.id,
      title: tag.data.title,
      description: tag.data.description
    }
  }
  return new TagsController();
};
