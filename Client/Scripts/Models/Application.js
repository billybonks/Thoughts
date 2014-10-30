'use strict';
App.Application = DS.Model.extend({
   token: DS.attr('string'),
   name: DS.attr('string'),
   userId:DS.attr('string')
    //user: DS.belongsTo('user'),
});
