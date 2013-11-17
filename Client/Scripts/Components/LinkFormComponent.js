App.LinkFormComponent = Ember.Component.extend({
  link:null,
  actions:{
    Submit: function(){
      //title to be set server side

      var card =this.get('card').get('id');
      var tags = this.get('tagger').getTags()
      var href = this.get('link');
      console.log(tags);
      if(this.urlIsWellFormed(href)){
        var data = {
          data: {
            link:href
          },
          tags:tags,
          type:'Link',
          cardsIn:[card],
          tagsIn:tags,
        }

        var link = this.store.createRecord('attachment', data);
        if(card){
          var cards =link.get('cards');
          //.find()
         // cards.pushObject(card)
        }
        link.save();
        this.set('link','');
      }else{
        //TODO : Implement form validation erros
        console.log('error')
      }
      //protocol index 2 //domain index 3
    }
  },
  urlIsWellFormed:function(url){
    var regex = /^((http[s]?|ftp[s]):\/)?\/?([^:\/\s]*)/
    var result = regex.exec(url);
    if(!result[2]){
      return false;
    }
    if(!result[3]){
      return false;
    }
    return true;
  }
});