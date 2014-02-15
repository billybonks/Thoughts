App.Template = DS.Model.extend({
  title: DS.attr('string'),
  user: DS.belongsTo('user', { async: true }),
  sections: DS.hasMany('section',{async:true}),
  tags:DS.hasMany('tag',{async:true}),
  sectionsIn:DS.attr()
});
