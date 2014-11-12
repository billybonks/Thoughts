'use strict';
App.CardController = Ember.ObjectController.extend({
  needs:['application'],
  application: Em.computed.alias('controllers.application'),//currentRouteName: Em.computed.alias('controllers.application'),
  views:null,
  perspective:null,
  actions: {
  },
  display: function() {
    if (this.get('parentController.templates')) {
      if (this.get('model.isTemplate')) {
        return true;
      }
    } else {
      if (this.get('model.isTemplate')) {
        return false;
      } else {
        return true;
      }
    }
  }.property('parentController.templates'),
  sortSomeAttachments: function() {
    var attachments = this.get('model').get('attachments');
    var tags = this.get('model').get('tags');
    var tit = this.get('model').get('title');
    return '';
  }.observes('model.attachments.@each.type'),
  position: function() {
    return 'left:' + this.get('model').get('left') + 'px;top:' + this.get('model').get('top') + 'px';
  }.property('model.left'),
});
