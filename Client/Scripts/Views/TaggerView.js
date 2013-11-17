App.TaggerView = Ember.View.extend({
  templateName: 'user',
  tagger : null,
  didInsertElement: function () {
    this.tagger = new Tagger($('#tags'), {
      source: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Dakota", "North Carolina", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
    });
  },
  getTags:function(){
    return this.tagger.getTags();
  }
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