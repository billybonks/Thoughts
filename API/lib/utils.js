var model = require('./../models/model');

exports.Model = model;

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
