'use strict';
App.File = DS.Model.extend({
  title:DS.attr('string'),
  url:DS.attr('string'),
  type:DS.attr('string'),
  size:DS.attr('string')
})
