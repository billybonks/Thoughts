'use strict';
App.Email = DS.Model.extend({
    from: DS.attr('string'),
    title: DS.attr('string'),
    body: DS.attr('string')
});
