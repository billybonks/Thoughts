App.Section = DS.Model.extend({
   title: DS.attr('string'),
   attachments: DS.hasMany('attachment',{async:true}),
   type: DS.attr('string'),
   position: DS.attr('number'),
   card:DS.belongsTo('card')
    //user: DS.belongsTo('user'),
});
