var Controller = require('./controller.js');
var error = require('./../lib/Errors.js').reject;
var Promise = require('./../lib/promise');
var model = require('./../models/tag');
var RSVP = require('rsvp');
module.exports = Controller.extend({
  getTags:function(ids) {
      return Promise.call(this, function(resolve, reject) {
          this.getNodes(ids).then(function(results) {
              var ret = []
              for (var i = 0; i < results.length; i++) {
                  var tag = new model();
                  tag.parse(results[i])
                  ret.push(tag);
              }
              resolve(ret);
          }, error(reject))
      });
  },
  _findByNames:function(names) {
      var nameDictionary = {}
      return Promise.call(this, function(resolve, reject) {
          var query = ['Match (node:Tag)']
          var variableHash = {}
          for (var i = 0; i < names.length; i++) {
              nameDictionary[names[i].toLowerCase()] = null;
              var varname = 'tag' + i;
              variableHash[varname] = names[i];
              var where
              if (i === 0) {
                  where = 'Where ';
              } else {
                  where = 'Or ';
              }
              where += 'node.title =~ "(?i)' + names[i] + '"';
              query.push(where);
          }
          query.push('return node');

          this.executeQuery(query.join('\n'), {}).then(function(results) {

              for (var i = 0; i < results.length; i++) {
                  var tag = new model();
                  tag.parse(results[i]);
                  nameDictionary[tag.get('title').toLowerCase()] = tag;
              }
              resolve(nameDictionary);
          }, error(reject));
      });
  },
  findOrCreate:function(names) {
      var context = this;
      var promises = [];
      return Promise.call(this, function(resolve, reject) {
          this._findByNames(names).then(function(nameDictionary) {
              console.log(nameDictionary);
              for (var key in nameDictionary) {
                  if (!nameDictionary[key.toLowerCase()]) {
                      promises.push(context._createTag.call(context, key, 'Add Description'));
                  }
              }
              RSVP.Promise.all(promises).then(function(tags) {
                  for (var i = 0; i < tags.length; i++) {
                      nameDictionary[tags[i].get('title').toLowerCase()] = tags[i];
                  }
                  console.log(nameDictionary.length)
                  console.log(nameDictionary.getJSON)
                  resolve(nameDictionary);
              }, error(reject))
          }, error(reject));
      });
  },
  removeTags:function(tags,entity){
    return Promise.call(this, function(resolve, reject) {
      var query = [this.buildStartStatement(tags),
                   'MATCH node-[r:Tagged]->entity',
                   'DELETE r',
                   'return node']
      this.executeQuery(query.join('\n'), {}).then(function(results){
        resolve(results)
      }, error(reject))
    })
  },
  //FIXME: Use createStartStatement
  tagEntity:function(tags, entityId) {
      return Promise.call(this, function(resolve, reject) {
          if (tags.length >= 1) {
              var tagEntityRelationShip = [];
              var temp = 'START node=node('
              for (var i = 0; i < tags.length; i++) {
                  temp += tags[i]
                  if (i < tags.length - 1) {
                      temp += ',';
                  }
              }
              temp += ')';
              temp += ', entity=node(' + entityId + ')';
              tagEntityRelationShip.push(temp);
              tagEntityRelationShip.push('CREATE node-[r:Tagged]->entity');
              tagEntityRelationShip.push('return node');
              this.executeQuery(tagEntityRelationShip.join('\n'), {})
                  .then(function(results) {
                    var ret = [];
                    for (var i = 0; i < results.length; i++) {
                        var tag = new model();
                        tag.parse(results[i]);
                        ret.push(tag);
                    }
                      resolve(ret);
                  }, error(reject));
          } else {
              resolve([]);
          }
      });
  },
  _createTag:function(title, description) {
      return Promise.call(this, function(resolve, reject) {
          var data = {
              title: title,
              description: description,
              date_created: Date.now(),
              date_modified: Date.now()
          };
          this.createNode(data, 'Tag').then(function(result) {
              var tag = new model();
              tag.parse(result[0]);
              resolve(tag);
          }, error(reject));
      });
  }
});
