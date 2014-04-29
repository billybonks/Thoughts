'use strict';
App.TaggerView = Ember.View.extend({
  templateName: 'TaggerView',
  tagger : null,
  tags:{},
  didInsertElement: function () {
    this.set('tags',{})
    this.tagger = new Tagger($('#tags'), {
      source: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
      tagAdded:this.get('tagAdded'),
      tagRemoved:this.get('tagRemoved'),
      context :this
    });
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

/*

        this.To = new Tagger($('#test2'), {
            source: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Dakota", "North Carolina", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
        });

                this.tagger = new Tagger($('#tags'), {
            source: function (partialTag, proxy) {
                $.ajax({
                    method: "get",
                    url: "api/Tags/TagSearch?partialTag=" + partialTag,
                    success: proxy
                });
            },
            processReturn: function (data) {
                if (data.Name) {
                    return data.id;
                } else {
                    return data
                };
            },
            property: 'Name'
        });



*/