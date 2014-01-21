App.LinksMainComponent = Ember.Component.extend({
  isEditing:false,
  title:'Links',
  actions:{
    edit:function(){
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
      console.log(this.get('popup'))
    },
    menu:function(){
      console.log('menu')
    }
  },
});

App.LinkFormComponent = Ember.Component.extend({
  link:null,
  actions:{
    Submit: function(){
      //title to be set server side

      var section =this.get('section').get('id');
      var tags = this.get('tagger').getTags()
      var href = this.get('link');
      console.log(tags);
      if(this.urlIsWellFormed(href)){
        var data = {
          data: {
            link:href
          },
          cardsIn:[section],
        }

        var link = this.store.createRecord('attachment', data);
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