App.Document = DS.Model.extend({
    title: DS.attr('string'),
});

App.Document.FIXTURES = [
 {
     id: 1,
     title: 'Plants',

 },
 {
     id: 2,
     title: 'Soil',
 },
 {
     id: 3,
     title: 'Teraformer',
 }
];