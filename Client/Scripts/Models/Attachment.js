'use strict';
App.Attachment = DS.Model.extend({
  data:DS.attr(),
  card:DS.belongsTo('card',{async:true}),
  tags:DS.hasMany('tag',{async:true}),
  type:DS.attr('string')
})