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
        if(this.model.get('left') == null){
          this.model.set('left',0);
          this.model.set('top',0);
        }
        if (this.x == -1) {
          this.x = event.clientX;
          this.y = event.clientY;
          return;
        }

        var left = parseInt(this.model.get('left'),10);
        var top = parseInt(this.model.get('top'),10);
        console.log(left-diffX)

        this.x = event.clientX;
        this.y = event.clientY;
      },
      after: function(name, timestamp, event, beforeRet) {
      }
    }
  }
});

App.CardFormComponent = Ember.Component.extend({
  title:null,
  description:null,
  store: null,
  actions:{
    Submit: function(){
      var tags = this.get('tagger').getTags()
       var data = {
        title: this.get('title'),
        left:0,
        top:0,
        tagsIn : tags
      }

      if(this.get('selectedTemplate')>0){
        data.template = this.get('selectedTemplate');
      }
      var card = this.store.createRecord('card', data);
      card.save();
      this.set('title','');
      this.set('description','');

    }
  },
});