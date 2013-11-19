App.WallView = Ember.View.extend(Ember.Evented, {
    layoutName : 'canvas',
    mouseMove: function (event) {
      console.log('mouseMoveEvent');
        Em.instrument("mouse.move",event,function(){},this)
       // this.trigger('movement', event);
    },
    mouseLeave: function (event) {
      //  console.log('mouseOut');
    },
    didInsertElement: function (arg1, arg2) {
      var model = this.get('controller').get('model')
      model.forEach(function(element){
        console.log(element.get('title'))
      })
       // var element = $(".containezr").zoomTo({ targetsize: 0.75, duration: 600 });
    }
    //// didInsertElement$(this)
});

/*
        Em.instrument("student.here", this.get('content'), function() {
            //mark student as in attendance
            this.set('inAttendance', !this.get('inAttendance'));
        }, this)

      {{outlet}}
</div>
*/
