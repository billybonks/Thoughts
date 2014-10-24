'use strict';
App.View = DS.Model.extend({
  name:DS.attr('string'),
  cards: DS.hasMany('card',{ async: true }),
  deleted: DS.attr('boolean'),
  templates: DS.attr('boolean'),
//  tags: DS.attr('tag'),
  root: DS.belongsTo('card',{ async: true }),
  lastPage: DS.attr('number'),
  default: DS.attr('boolean'),
  query: DS.attr('string')
});
