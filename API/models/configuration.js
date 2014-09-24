var model = require('./model')();


module.exports = function() {

    function Configuration(node) {
        this.data = {};
        this.relationships = ['configures','for']
        if (node) {
            this.data.id = node.id;
            this.data.position = node.position;
            this.data.embedded = node.embedded;
            this.data.for = node.for;
            this.data.configures = node.configures;
        }
    }

    Configuration.prototype = new model();

    

    Configuration.prototype.toSideload = function() {
        return this.data;
    }

    Configuration.parseArray = function(node) {
        return new Configuration(node);
    }



    return Configuration;
}
/*
this.relationships= [{
    attr: 'for',
    name: 'Targets',
    direction: 'out'
}, {
    attr: 'configures',
    name: 'Configures',
    direction: 'out'
}]

position: DS.attr('number'),
embedded: DS.attr('boolean'),
for: DS.attr('number'),
configures:DS.belongsTo('card',{async:true}),

*/
