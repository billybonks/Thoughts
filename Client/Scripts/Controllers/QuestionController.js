App.QuestionController = Ember.ObjectController.extend({
   displayAnswer : false,
   class:'panel-collapse collapse in',
   actions:{
     UpdateQuestion:function(){
       console.log(this.get('model').get('data').answer)
       this.get('model').save();
       this.get('isEditingAnswer')? this.set('isEditingAnswer', false): this.set('isEditingAnswer', true);
     },
     ToggleAnswer:function(){
        this.get('displayAnswer')? this.set('displayAnswer', false): this.set('displayAnswer', true);
     },
     ToggleEditAnswer:function(){
       this.get('isEditingAnswer')? this.set('isEditingAnswer', false): this.set('isEditingAnswer', true);
     },
     NewAnswer:function(){
        this.get('model').get('data').answer = this.get('answer');
        this.get('model').save();
        this.get('isEditingAnswer')? this.set('isEditingAnswer', false): this.set('isEditingAnswer', true);
     }
   },
   answerClass:function(){
     if(this.get('displayAnswer')){
       return 'panel-collapse collapse in'
     }
     return 'panel-collapse collapse out'
   }.property('displayAnswer')
});