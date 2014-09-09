'use strict';
App.TaggerView = Ember.View.extend({
  templateName: 'TaggerView',
  tagger : null,
  tags:{},
  didInsertElement: function () {
    this.set('tags',{})
    this.tagger = $('#tags').tagger({
      source: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
      tagAdded:this.get('tagAdded'),
      tagRemoved:this.get('tagRemoved'),
      context :this
    }).tagger;
    this.set(this.get('instanceBinding._from'),this.tagger)
  },
  tagAdded:function(item){
    this.get('tags')[item] = item;
    this.tagsObserver();
  },
  tagRemoved:function(item){
    delete this.get('tags')[item];
    this.tagsObserver();
  },
  tagsObserver:function(){
    console.log('updating binding')
    var qTags = [];
    for(var key in this.get('tags')){
      if(this.get('tags').hasOwnProperty(key)){
        qTags.push(this.get('tags')[key]);
      }
    }
    this.set(this.get('contentBinding._from'),qTags)
  }.observes('tags')
});
