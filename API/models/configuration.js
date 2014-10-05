'use strict';
var DS = require('./../lib/ds');

module.exports = DS.Model.extend({
  position: DS.attr('number'),
  embedded: DS.attr('boolean'),
  for: DS.belongsTo('card'),
  configures:DS.belongsTo('card'),
});
