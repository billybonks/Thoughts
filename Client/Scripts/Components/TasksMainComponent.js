App.TasksMainComponent = App.BaseSectionComponent.extend({
  title:'Tasks',
  actions:{
    CreateTask:function(){
      var data = {
        title:this.get('newTask'),
      }
      this.submitAttachment(data);
      this.set('newTask','');
    }
  },
  willInsertElement:function(){
  }
});