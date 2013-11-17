App.Attachment = DS.Model.extend({
  data:DS.attr(),
  type:DS.attr('string'),
  cards:DS.belongsTo('card'),
  tags:DS.hasMany('tag'),
  cardsIn:DS.attr(),
  tagsIn:DS.attr()
})