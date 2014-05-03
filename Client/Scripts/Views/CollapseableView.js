App.CollapseableView = Ember.View.extend({
  click: function(event) {
    return this.$('.collapseable').collapse('toggle');
  }
});

App.CollapseableContent = Ember.View.extend({
  classNames: ['collapseable', 'collapse'],
  click: function(event) {
    return event.stopPropagation();
  }
});