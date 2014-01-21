App.PropertyMainComponent = App.BaseSectionComponent.extend({
  types:['string','number'],
  actions:{
    CreateProperty:function(){
      var data = {
        name:this.get('name'),
        value:this.get('value'),
        type:this.get('selectedType')
      }
      this.submitAttachment(data);
      this.set('name','');
      this.set('value','');
    }
  },

  willInsertElement:function(){
  }
});

App.TableEntryComponent = Ember.Component.extend({
    isNediting:false,
    isVediting:false,
    actions:{
      toggleV:function(){},
      toggleN:function(){},
    }
})