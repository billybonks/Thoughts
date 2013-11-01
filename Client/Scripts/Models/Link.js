App.Link = DS.Model.extend({
  title: DS.attr('string'),
  href: DS.attr('string'),
  user: DS.belongsTo('user', { async: true })
});

