'use strict';
var DS = require('./../lib/ds');

module.exports = DS.Model.extend({
    cards: DS.hasMany('card'),
    deleted: DS.attr('boolean'),
    templates: DS.attr('boolean'),
    tags: DS.attr('tag'),
    root: DS.belongsTo('card'),
    lastPage: DS.attr('number'),
    default: DS.attr('boolean')
});
