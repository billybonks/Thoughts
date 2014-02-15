App.LinksMainComponent = App.BaseSectionComponent.extend({
  isEditing:false,
  title:'Links',
  actions:{
    edit:function(){
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
      console.log(this.get('popup'))
    },
    Submit: function(){
      //title to be set server side

      var href = this.get('newLink');
      if(this.urlIsWellFormed(href)){
        var data =
          {
            link:href
          }
        this.submitAttachment(data);
        this.set('newLink','');
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