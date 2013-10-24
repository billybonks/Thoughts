App.Link = DS.Model.extend({
    title: DS.attr('string'),
    href: DS.attr('string')
});

App.Link.FIXTURES = [
 {
     id: 1,
     href: 'www.plantgrowers.com',
     title: 'plantgrowers'

 },
 {
     id: 2,
     href: 'www.soilQualityTutorials.com',
     title: 'soilQualityTutorials'
 },
 {
     id: 3,
     href: 'www.plantsteraformers.com',
     title: 'plantsteraformers'
 }
];