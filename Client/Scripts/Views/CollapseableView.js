App.CollapseableView = Ember.View.extend({
  click: function(event) {
    return this.$('.collapseable').collapse('toggle');
  }
});
