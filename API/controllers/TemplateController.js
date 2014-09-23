var controller = require('./Controller.js');
var error = require('./../lib/Errors.js').reject;
var Promise = require('./../lib/promise')
var Template = require('./../models/template')();

module.exports = function() {
    'use strict';
    needs:['card']
    /* ========================================================================================================
     *
     * Class Setup - Keep in alphabetical order
     *
     * ===================================================================================================== */
    function TemplateController() {}

    TemplateController.prototype = new controller();


    //todo: return user and section
    TemplateController.prototype.GetTemplates = function(auth) {
        return Promise.call(this, function(resolve, reject) {
            var query = ['match (template:Card)',
                'where template.isTemplate = true',
                'AND not(has(template.isDeleted))',
                'return template'
            ];
            return this.executeQueryRSVP(query.join('\n'), {}).then(function(results) {
                resolve(Template.parseArray(results));
            }, error(reject));
        });
    };

    TemplateController.prototype.GetObject = function(template) {
        return {
            id: template.id,
            title: template.data.title
        };
    };
    return new TemplateController();
};
