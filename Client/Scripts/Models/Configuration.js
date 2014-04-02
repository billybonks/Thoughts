'use strict';
App.Configuration = DS.Model.extend({
  position: DS.attr('number'),
  embedded: DS.attr('bool'),
  'for': DS.belongsTo('card', { async: true }),
  configures:DS.hasMany('card',{async:true}),
});
