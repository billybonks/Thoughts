var Controller = require('./Controller.js');
var error = require('./../lib/Errors.js').reject;
var Promise = require('./../lib/promise')

module.exports = function() {
    'use strict';
    /* ========================================================================================================
     *
     * Class Setup - Keep in alphabetical order
     *
     * ===================================================================================================== */
    function SettingsController() {}

    SettingsController.prototype = new Controller();

    //FIXME: Add settings model
    SettingsController.prototype.GetSettings = function(user) {
        return Promise.call(this, function(resolve, reject) {
            var settings = {
                id: 0
            };
            var context = this;
            settings.first_name = user.first_name;
            console.log('getting accounts')
            this.GetUserLinkedAccounts.call(context, user.id).then(function(accounts) {
              console.log('got accounts')
                for (var i = 0; i < accounts.length; i++) {
                    var label = accounts[i]['labels(account)'][0];
                    console.log(label)
                    if (label === 'Facebook') {
                        settings.facebook = true;
                    }
                    if (label === 'Google') {
                        settings.facebook = true;
                    }
                }
                resolve(settings);
            }, error(reject))
        });
    }

    //FIXME: Does this duplicate with getfulluser
    SettingsController.prototype.GetUserLinkedAccounts = function(userId) {
        return Promise.call(this, function(resolve, reject) {
            var query = "Start user=node(" + userId + ") Match user-[l:Linked]->account return labels(account)";
            this.executeQueryRSVP(query, {}).then(function(results) {
                resolve(results);
            }, error(reject))
        });
    }

    return new SettingsController();
};
