'use strict';
App.Configuration = DS.Model.extend({
  position: DS.attr('number'),
  embedded: DS.attr('boolean'),
  for: DS.attr('number'),
  configures:DS.belongsTo('card',{async:true}),
});
