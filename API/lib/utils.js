var model = require('./../models/model');

exports.Model = model;

/**
  Merge the contents of two objects together into the first object.

  ```javascript
  Ember.merge({first: 'Tom'}, {last: 'Dale'}); // {first: 'Tom', last: 'Dale'}
  var a = {first: 'Yehuda'}, b = {last: 'Katz'};
  Ember.merge(a, b); // a == {first: 'Yehuda', last: 'Katz'}, b == {last: 'Katz'}
  ```

  @method merge
  @for Ember
  @param {Object} original The object to merge into
  @param {Object} updates The object to copy properties from
  @return {Object}
*/
exports.merge = function(original, updates) {
  for (var prop in updates) {
    if (!updates.hasOwnProperty(prop)) { continue; }
    original[prop] = updates[prop];
  }
  return original;
}

exports.filter = function(array,property,value) {
  for(var i =0;i<array.length;i++){
    for (var prop in array[i].data) {
      if(prop === property){
        if(array[i].data[prop] === value)
          return array[i]
      }
    }
  }
}

exports.arrayToJSON = function(modelArray) {
    var ret = [];
    for (var i = 0; i < modelArray.length; i++) {
        ret.push(modelArray[i].getJSON())
    }
    return ret;
}

exports.dictionaryToJSON = function(modelDictionary) {
    var ret = []
    for (var key in modelDictionary) {
        ret.push(modelDictionary[key].getJSON());
    }
    return ret;
}

exports.modelFor = function(type) {
    return require('./../models/' + type);
}


exports.toPlural = function(word) {
    var plural = null;
    if (word.charAt(word.length - 1) === 'y') {
        plural = word.substring(0, word.length - 1) + 'ies';
    } else {
        plural = word + 's';
    }
    return plural.toLowerCase();
}

exports.toSingular = function(word) {
    var singular = null;
    if (word.substring(word.length-3, word.length) === 'ies') {
        singular = word.substring(0, word.length - 3);
    } else {
        singular = word.substring(0, word.length - 1)
    }
    return singular.toLowerCase();
}
