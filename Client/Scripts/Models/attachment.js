'use strict';
App.Attachment = DS.Model.extend({
  data:DS.attr(),
  sectionid:DS.attr(),
  tags:DS.hasMany('tag'),
  type:DS.attr('string')
})