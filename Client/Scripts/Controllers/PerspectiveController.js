App.PerspectiveController = Ember.ArrayController.extend({
  Notify: function(message, level) {
    this.send('notification', message, level);
  },
});
