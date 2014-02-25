'use strict';
App.Section = DS.Model.extend({
   title: DS.attr('string'),
   attachments: DS.hasMany('attachment',{async:true}),
   type: DS.attr('string'),
   position: DS.attr('number'),
   card:DS.belongsTo('card'),
   collapsed:DS.attr('boolean')
    //user: DS.belongsTo('user'),
});
