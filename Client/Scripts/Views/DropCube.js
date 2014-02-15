App.DropCube = Ember.View.extend({
  templateName:'Qube',
  click:function(e){
    console.log('clicked')
  },
  dragEnter:function(e){console.log('ENTER')},
  dragLeave:function(e){console.log('LEAVE')},
  drop:function(e){
    console.log('DROPPED');
  }
})