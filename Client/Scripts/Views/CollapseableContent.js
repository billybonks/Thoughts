App.CollapseableContent = Ember.View.extend({
  classNames: ['collapseable', 'collapse'],
  click: function(event) {
    return event.stopPropagation();
  }
});
