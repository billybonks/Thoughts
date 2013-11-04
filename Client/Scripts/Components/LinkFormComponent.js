App.LinkFormComponent = Ember.Component.extend({
  link:null,
  actions:{
      Submit: function(){
        //title to be set server side

        var href = this.get('link');

        if(this.urlIsWellFormed(href)){
          var link = this.store.createRecord('link', {
            link: href
          });
          link.set('title','');
          link.set('href',this.get('link'));
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