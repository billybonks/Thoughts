'use strict';
App.QuestionController = Ember.ObjectController.extend(App.SubmitAttachmentMixin,{
   displayAnswer : false,
   class:'panel-collapse collapse in',
   actions:{
     UpdateQuestion:function(){
       console.log(this.get('model').get('data').answer)
       this.SaveAttachment(this.get('model'));
       this.get('isEditingAnswer')? this.set('isEditingAnswer', false): this.set('isEditingAnswer', true);
     },
     ToggleAnswer:function(){
        this.get('displayAnswer')? this.set('displayAnswer', false): this.set('displayAnswer', true);
     },
     ToggleEditAnswer:function(){
       this.get('isEditingAnswer')? this.set('isEditingAnswer', false): this.set('isEditingAnswer', true);
     }
   },
   answerClass:function(){
     if(this.get('displayAnswer')){
       return 'panel-collapse collapse in'
     }
     return 'panel-collapse collapse out'
   }.property('displayAnswer'),
   text:function(){
    var converter = new Markdown.Converter();
    if(this.get('model.data.answer')){
      return converter.makeHtml(this.get('model.data.answer'));
    }
    return '';//model.data.answer
  }.property('model.data.answer')
});
