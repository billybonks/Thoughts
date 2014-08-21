'use strict';
App.CardController = Ember.ObjectController.extend(App.PopupOpenerMixin, {
  //currentRouteName: Em.computed.alias('controllers.application.currentRouteName'),
  currentPath: Em.computed.alias('controllers.application.currentPath'),
  needs: 'application',
  actions: {
    CreateNotification: function(message, level) {
      this.send('notification', message, level);
    },
    Delete: function() {
      this.get('store').find('card', this.get('model').get('id')).then(function(rec) {
        rec.deleteRecord();
        rec.save();
      });
    },
    ToggleEdit: function() {
      console.log('editing')
      this.get('isEditing') ? this.set('isEditing', false) : this.set('isEditing', true);
    },
    Share: function() {}
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
