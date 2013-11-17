App.CardMainComponent = Ember.Component.extend({
  isFocoused: false,
  eventID: -1,
  dragFunction:null,
  editing:false,
  subscription:null,
  actions: {
    StartDrag: function (application) {
      console.log('drag');
      subscription = Em.subscribe('mouse',this.get('MouseMove')(this.get('model')));
    },
    StopDrag: function (model) {
      model.save();
      Ember.Instrumentation.unsubscribe(this.get('subscription'))
    },
    focus: function () {
      this.set('isFocoused', this.get('isFocoused') ? false : true);
      console.log(this.get('isFocoused'));
    },
    ToggleEdit : function(){
      var ed =this.get('editing');
      this.set('editing', this.get('editing') ? false : true);
      return false;
    },
    Delete: function(){
      console.log('delete');
      var card = this.get('model');
      card.deleteRecord();
      card.save();
    }
  },
  MouseMove: function (model) {
    return {
      model: model,
      x : -1,
      y : -1,
      before: function(name, timestamp, event) {
        console.log(this.x)
        console.log(event.clientX)
        if (this.x == -1) {
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