'use strict';
App.Comment = DS.Model.extend({
    body: DS.attr('string'),
    idea: DS.belongsTo('Card'),
    user: DS.belongsTo('user')
});