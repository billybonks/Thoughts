'use strict';
App.Configuration = DS.Model.extend({
  position: DS.attr('number'),
  embedded: DS.attr('boolean'),
  //for: DS.belongsTo('card', { async: true }),
  configures:DS.belongsTo('card',{async:true}),
});
