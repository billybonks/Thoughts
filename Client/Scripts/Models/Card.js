'use strict';
App.Card = DS.Model.extend({
  title: DS.attr('string'),
  left: DS.attr('number'),
  top: DS.attr('number'),
  user: DS.belongsTo('user', { async: true }),
  attachments: DS.hasMany('attachment',{async:true}),
  sections: DS.hasMany('section',{async:true}),
  tags:DS.hasMany('tag',{async:true}),
  tagsIn:DS.attr(),
  onMainDisplay:DS.attr('boolean'),
  template: DS.attr(),
  isTemplate:DS.attr('boolean')
});
