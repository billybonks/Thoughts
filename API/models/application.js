'use strict';
var DS = require('./../lib/ds');

module.exports = DS.Model.extend({
   token: DS.attr('string'),
   name: DS.attr('string'),
   user: DS.belongsTo('user'),
   userId:DS.attr('string')
});
