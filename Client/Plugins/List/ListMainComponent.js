'use strict';
App.ListMainComponent = App.BaseSectionComponent.extend({
  isEditing:false,
  title:'Links',
  actions:{
    Edit:function(){
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
    },
    Submit: function(){
      //title to be set server side
      var href = this.get('newLink');
      if(href === '' || typeof href === 'undefined'){
        return;
      }
      var data;
      if(this.urlIsWellFormed(href)){
        data =
          {
            link : href
          }

      }else if(href.indexOf('card:') ===0){
        data =
          {
            card : href
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
