App.User = DS.Model.extend({
    name: DS.attr('string'),
    email: DS.attr('string')
});

App.User.FIXTURES = [
 {
     id: 1,
     name: 'Sebastien',
     email: 'sebastienstettler@gmail.com'

 },
 {
     id: 2,
     name: 'Billybonks',
     email: 'billybonks@gmail.com'

 }
];