App.Idea = DS.Model.extend({
    title: DS.attr('string'),
    description: DS.attr('string'),
    documents: DS.hasMany('document', { async: true }),
    links: DS.hasMany('link', { async: true }),
    left: DS.attr('int'),
    top: DS.attr('int'),
    comments: DS.hasMany('comment', { async: true }),
    user: DS.belongsTo('user', { async: true }),
    test: function () {
        this.get('links').forEach(function (entry) {
            console.log('title');
        });
    }.property('links')
});

App.Idea.FIXTURES = [
 {
     id: 1,
     title: 'Perma culture townships',
     description: 'its hectic, thats why we need to implement permaculture into the townships. like imagine community dumping spots where everything is organised. organic matter, recyclables etc etc etc.only issue is i wonder what the scale is, so would have to have many around the place. then you use the organic matter to make compost. use recyclables for crazy projects like plastic bottle couches',
     documents: [1],
     links: [1,2],
     comments: [1],
     user: 1,
     left: '0',
     top: '0'

 },
 {
     id: 2,
     title: 'Garden packs',
     description: 'Need to find an easy way to work with soil, test it and improve it, so that packs can be built in large quantities',
     documents: [2],
     links: [2],
     comments: [2],
     user: 1,
     left: '600',
     top: '0'
 },
 {
     id: 3,
     title: 'Why is a interactive board cool',
     description: 'Dynamically allows you to ',
     documents: [3],
     links: [3],
     comments: [3],
     user: 1,
     left: '1200',
     top: '0'
 },
  {
      id: 4,
      title: 'Make a fucking psytrance party',
      description: 'swaroop babji nuff said, teach these minds about some crazy mind bending psytrance',
      documents: [],
      links: [],
      comments: [],
      user: 1,
      left: '600',
      top: '300'
  },
    {
        id: 5,
        title: 'rdp houses',
        description: 'one idea would be to build vertical gardens on the roofs,very well implemented in Mauritius because of hurricanes, Flat roofed houses present other challenges, such as leaking etc. Not to mention the increased cost of the structure, to support the increased weight',
        documents: [],
        links: [],
        comments: [],
        user: 1,
        left: '0',
        top: '400'
    },
    {
        id: 6,
        title: 'Soil Improvement stratergy',
        description: 'some loream ipsum for you',
        documents: [],
        links: [],
        comments: [],
        user: 1,
        left: '1200',
        top: '300'
    },
        {
            id: 7,
            title: 'attacth usefull facebook posts',
            description: 'some loream ipsum for you',
            documents: [],
            links: [],
            comments: [],
            user: 1,
            left: '1200',
            top: '600'
        },
        {
            id: 8,
            title: 'just a quick place for some site builds',
            description: 'allow ideas to "buildFrom" "buildTo" "Linked" \n minimize entire card so only title visible',
            documents: [],
            links: [],
            comments: [],
            user: 1,
            left: '600',
            top: '600'
        },
        {
            id: 9,
            title: 'Test case',
            description: 'Afrika burn planning, finding ideas groups building with strangers',
            documents: [],
            links: [],
            comments: [],
            user: 1,
            left: '600',
            top: '600'
        },
];