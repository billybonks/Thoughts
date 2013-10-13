App.Comment = DS.Model.extend({
    body: DS.attr('string'),
    idea: DS.belongsTo('idea'),
    user: DS.belongsTo('user')
});

App.Comment.FIXTURES = [
 {
     id: 1,
     body: 'Cool Idea',

 },
 {
     id: 2,
     body: 'Lets test some sand',
 },
 {
     id: 3,
     body: 'Ahoy Ahoy',
 }
];