App.QuestionMainComponent = App.BaseSectionComponent.extend({
  layoutName:'cardview',
  title:'Questions',
  actions:{
    CreateQuestion:function(){
      var data={
        question:this.get('newQuestion')
      }
      this.submitAttachment(data);
      this.set('newQuestion','')
    },
    ToggleEdit:function(){
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
    }
  },
  willInsertElement:function(){
    console.log('setting Up');
    console.log(this.get('layoutName'));
    this.set('layoutName','cardview');
  }
});