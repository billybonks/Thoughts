'use strict';
App.Setting = DS.Model.extend({
  name: DS.attr('string'),
  email: DS.attr('string'),
  facebook: DS.attr('boolean'),
  google: DS.attr('boolean'),
});
