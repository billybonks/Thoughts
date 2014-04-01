'use strict';
App.Template = DS.Model.extend({
  title: DS.attr('string'),
  user: DS.belongsTo('user', { async: true }),
  tags:DS.hasMany('tag',{async:true}),
});
