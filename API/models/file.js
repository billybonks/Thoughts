'use strict';
var DS = require('./../lib/ds');

module.exports = DS.Model.extend({
  title:DS.attr('string'),
  url:DS.attr('string'),
  type:DS.attr('string'),
  size:DS.attr('string')
})
