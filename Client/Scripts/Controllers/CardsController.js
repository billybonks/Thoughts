'use strict';
App.CardsIndexController = Ember.ArrayController.extend(App.NewCardMixin, {
  views: ['Cards', 'Templates'],
  currentView: null,
  templates: false,
  cards: true,
  displaySide: false,
  loaded: false,
  actions: {
    toggle: function() {
      this.get('displaySide') ? this.set('displaySide', false) : this.set('displaySide', true);
    },
    loadMore: function() {
      this.loadMoreCards();
    }
  },
  onViewChange: function() {
    if (this.get('loaded')) {
      if (!this.get('currentView.loaded')) {
        this.loadMoreCards();
      }
    }
  }.observes('currentView'),
  loadMoreCards: function() {
    var context = this;
    var xhr = new XMLHttpRequest();

    xhr.open('GET', window.AppSettings.WebserviceURL + '/views/more?id=' + this.get('currentView.id') + '&page=' + (this.get('currentView.lastPage') + 1));
    xhr.onreadystatechange = handler;
    xhr.responseType = 'json';
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Authorization', window.AppSettings.token);
    xhr.send();

    function handler() {
      if (this.readyState === this.DONE) {
        if (this.status === 200) {
          var response = context.store.pushMany('card', this.response.cards);
          context.get('currentView.cards').pushObjects(response);
          if (response.length < 10) {
            context.set('currentView.loaded', true)
          }
        }
      }
    }
  },
  Notify: function(message, level) {
    this.send('notification', message, level);
  },
  viewSwapper: function() {
    if (this.get('selectedView') === 'Templates') {
      this.set('templates', true);
      this.set('cards', false);
    }
    if (this.get('selectedView') === 'Cards') {
      this.set('templates', false);
      this.set('cards', true);
    }
  }.observes('selectedView'),
  display: function(model) {
    if (this.get('templates')) {
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
  cardFormPackage: function() {
    var cardPackage = {}
    cardPackage.parent = null;
    cardPackage.onMainDisplay = true;
    return cardPackage;
  }.property()
});
