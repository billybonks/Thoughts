module.exports = function() {

    function Configuration(node) {
        this.relationships: [{
            attr: 'for',
            name: 'Targets',
            direction: 'out'
        }, {
            attr: 'configures',
            name: 'Configures',
            direction: 'out'
        }]
        if (node) {
            this.id = node.id;
            this.position = node.data.position;
            this.embedded = node.data.embedded;
            this.for = node.data.for;
            this.configures = node.data.configures;
        }
    }

    Configuration.prototype.toSideload = function() {
        return this.model;
    }

    Configuration.parse = function(node) {
        return new Configuration(node);
    }

    Configuration.parseArray = function(node) {
        return new Configuration(node);
    }

    return Configuration;
}
/*

position: DS.attr('number'),
embedded: DS.attr('boolean'),
for: DS.attr('number'),
configures:DS.belongsTo('card',{async:true}),

*/
