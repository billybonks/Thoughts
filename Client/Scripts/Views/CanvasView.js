﻿App.WallView = Ember.View.extend(Ember.Evented, {
    layoutName : 'canvas',
    mouseMove: function (event) {
        this.trigger('movement', event);
    },
    mouseLeave: function (event) {
      //  console.log('mouseOut');
    },
    didInsertElement: function (arg1, arg2) {
       // var element = $(".containezr").zoomTo({ targetsize: 0.75, duration: 600 });
    }
    //// didInsertElement$(this)
});

/*

      {{outlet}}
</div>
*/