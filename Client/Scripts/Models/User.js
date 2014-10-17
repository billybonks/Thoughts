'use strict';
App.User = DS.Model.extend({
  name: DS.attr('string'),
  email: DS.attr('string'),
  profileImg: DS.attr('string'),
  firstname: DS.attr('string')
});
