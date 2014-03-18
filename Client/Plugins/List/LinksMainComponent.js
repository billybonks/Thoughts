'use strict';
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
      var data;
      if(this.urlIsWellFormed(href)){
        data =
          {
            link : href
          }

      }else{
        data =
          {
            title : href
          }
      }
      this.submitAttachment(data);
      this.set('newLink','');
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
