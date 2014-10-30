var Controller = require('./controller.js');
var error = require('./../lib/Errors.js').reject;
var Promise = require('./../lib/promise');
var Model = require('./../models/view');
var utils = require('./../lib/utils');
var CardController = require('./CardController.js');

module.exports = Controller.extend({
    needs: ['card'],
    cardController: new CardController(),
    getViews: function(user) {
        return Promise.call(this, function(resolve, reject) {
            var recentlyAdded = new Model()
            recentlyAdded.update({
                name:'Recent',
                id: 1111111,
                deleted: false,
                templates: false,
                lastPage: -1,
                cards: [],
                default: true,
                root: null,
                loaded:false,
            })
            var deleted = new Model()
            deleted.update({
                name:'Deleted',
                id: 22222222,
                deleted: true,
                templates: false,
                lastPage: -1,
                cards: [],
                default: false,
                root: null,
                loaded:false,
            })
            var templates = new Model()
            templates.update({
                name:'My Types',
                id: 33333333,
                deleted: false,
                templates: true,
                lastPage: -1,
                cards: [],
                default: false,
                root: null,
                loaded:false,
            })
            var views = [recentlyAdded, deleted, templates];
            resolve(views)
        });
    },
    getView: function(id) {
        return Promise.call(this, function(resolve, reject) {
            this.getViews().then(function(views){
              resolve(utils.filter(views, 'id', id));
            })
        });
    },

    loadPage: function(view, page,user) {
        return Promise.call(this, function(resolve, reject) {
            this.cardController.getViewsCards(view,page, user).then(function(cards) {
                resolve(cards)
            })
        });
    },
    loadPage2: function(view, page,user) {
        return Promise.call(this, function(resolve, reject) {
            this.cardController.getViewsCards2(view,page, user).then(function(cards) {
                resolve(cards)
            })
        });
    }
});
