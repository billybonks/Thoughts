var model = require('./../models/model');

exports.Model = model;

exports.hasMany = function(type) {
    return {
        type: type,
        direction: 'in',
        amount:'many'
    }
}

exports.belongsTo = function(type) {
    return {
        type: type,
        direction: 'out',
        amount:'single'
    }
}

exports.attr = function(type) {
    return {
        type: type,
        direction: 'attr'
    }
}
