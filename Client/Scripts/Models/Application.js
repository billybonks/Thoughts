App.Application = DS.Model.extend({
    name: DS.attr('string'),
    token: DS.attr('string'),
});

App.Application.FIXTURES = [
 {
     id: 'ED1FE4C627DAC6514F953909E1F24DBF',
     name: 'Sebastien',
     token: 'asdm'

 }
];