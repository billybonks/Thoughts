'use strict';
App.DraggableCardView = Ember.View.extend({
  layoutName: 'draggablecard',
  subscription:null,
  mouseDown:function(event){
    var model = this.get('controller').get('model');
    this.set('subscription',Em.subscribe('mouse',this.get('MouseMove')(model)));
    return false;
  },
  mouseUp:function(event){
    var model = this.get('controller').get('model');
    Ember.Instrumentation.unsubscribe(this.get('subscription'));
    model.save();
    return false;
  },
  MouseMove: function (model) {
    return {
      model: model,
      x : -1,
      y : -1,
      before: function(name, timestamp, event) {
        console.log(this.x)
        console.log(event.clientX)
       if(this.model.get('left') === null){
          this.model.set('left',0);
          this.model.set('top',0);

        }
        if (this.x === -1) {
          this.x = event.clientX;
          this.y = event.clientY;
          return;
        }
        var diffX = this.x - event.clientX;
        var diffY = this.y - event.clientY;
        var left = parseInt(this.model.get('left'),10);
        var top = parseInt(this.model.get('top'),10);
        console.log(left-diffX)
        this.model.set('left', left-diffX);
        this.model.set('top', top - diffY);
        this.x = event.clientX;
        this.y = event.clientY;
      },
      after: function(name, timestamp, event, beforeRet) {
      }
    }
  }
});