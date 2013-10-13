App.Email = DS.Model.extend({
    from: DS.attr('string'),
    title: DS.attr('string'),
    body: DS.attr('string')
});

App.Email.FIXTURES = [
 {
     id: 1,
     title: 'Perma culture townships',
     body: 'its hectic, thats why we need to implement permaculture into the townships. like imagine community dumping spots where everything is organised. organic matter, recyclables etc etc etc.only issue is i wonder what the scale is, so would have to have many around the place. then you use the organic matter to make compost. use recyclables for crazy projects like plastic bottle couches'
 }
 ]