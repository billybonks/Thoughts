'use strict';
var DS = require('./../lib/ds');

module.exports = DS.Model.extend({
  title: DS.attr('string'),
  left: DS.attr('number'),
  top: DS.attr('number'),
  user: DS.belongsTo('user', { async: true }),
  attachments: DS.hasMany('attachment',{async:true}),
  tags:DS.hasMany('tag',{async:true}),
  onMainDisplay:DS.attr('boolean'),
  template: DS.attr(),
  isTemplate:DS.attr('boolean'),
  parents:DS.hasMany('card', {
    inverse: 'children',
    async:true
  }),
  children:DS.hasMany('card', {
    inverse: 'parents',
    async:true
  }),
  configurations: DS.hasMany('configuration',{async:true}),
  type: DS.attr('string'),
});
