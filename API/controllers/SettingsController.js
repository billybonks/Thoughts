var Controller = require('./controller.js');
var error = require('./../lib/Errors.js').reject;
var Promise = require('./../lib/promise')

module.exports = Controller.extend({
    //FIXME: Add settings model
    GetSettings: function(user) {
        return Promise.call(this, function(resolve, reject) {
            var settings = {
                id: 0
            };
            var context = this;
            settings.first_name = user.get('first_name');
            for (account in user.accounts) {
                settings[account] = true;
            }
            resolve(settings);
        });
    }
});
