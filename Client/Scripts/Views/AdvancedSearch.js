App.AdvancedSearch = Ember.View.extend({
  templateName:'popups/advancedSearch',
  actions:{
    addQuery:function(){
      this.get('content.queries').pushObject({selectedObject:null,value:null,selectedAction:null})
    },
    deleteQuery:function(query){
      this.get('content.queries').removeObject(query)
    }
  },
  getQuery:function(){
    var qs = this.get('content.queries');
    var query = '';
    for(var i = 0;i<qs.length;i++){
      var value =qs[i].value ;
      if(value != null){
      value = value.trim();
      }else{
        continue;
      }
      if(value != ''){
        query+=qs[i].selectedObject
        if(qs[i].selectedAction === 'isEqual'){
          query+=('='+value)
        }else if(qs[i].selectedAction === 'contains'){
          query+=('~'+value)
        }
        query+=';'
      }
    }
    return query;
  }
});
