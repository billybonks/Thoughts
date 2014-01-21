App.Attachment = DS.Model.extend({
  data:DS.attr(),
  section:DS.belongsTo('section'),
  sectionid:DS.attr(),
  tags:DS.hasMany('tag'),
  cardsIn:DS.attr(),
  tagsIn:DS.attr(),
  type:DS.attr('string')
})