App.Idea = DS.Model.extend({
    title: DS.attr('string'),
    description: DS.attr('string'),
    left: DS.attr('number'),
    top: DS.attr('number'),
    user: DS.belongsTo('user', { async: true })
});
