'use strict';
var DS = require('./../lib/ds');

module.exports = DS.Model.extend({
  word:'Tag',
  title: DS.attr('string'),
  description: DS.attr('string')
});
