'use strict';
App.FlipSwitchComponent = Ember.Component.extend({
  didInsertElement:function(){
    this.$("[type=checkbox]").bootstrapSwitch();
  }
});
