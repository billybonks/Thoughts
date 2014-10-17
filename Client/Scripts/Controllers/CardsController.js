'use strict';
App.CardsIndexController = Ember.ArrayController.extend({
  views: null,
  currentView: null,
  templates: false,
  cards: true,
  loaded: false,
  actions: {
    loadMore: function() {
      this.loadMoreCards();
    },
  },
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
  }
});
