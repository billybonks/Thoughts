App.Application = DS.Model.extend({
    token: DS.attr('string'),
    user: DS.belongsTo('user'),
});

App.Application.FIXTURES = [
 {
     id: 'ED1FE4C627DAC6514F953909E1F24DBF',
     name: [1],
     token: 'asdm'

 }
];