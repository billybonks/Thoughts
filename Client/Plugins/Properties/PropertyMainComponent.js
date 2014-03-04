'use strict';
App.PropertyMainComponent = App.BaseSectionComponent.extend({
  didInsertElement:function(){
    console.log(this.toString());
    this.SubscribePopup(this);
  },
  context:function(){
    return this
  }.property(),
});