module.exports = function() {

    function Core() {

    }

    Core.prototype.init = function() {

    }

    Core.extend = function(object) {
        var proto = this.prototype;
        proto.relationships = [];
        this.prototype = proto;
        var Class = function() {
            if (this.init) {
                this.init();
            }
        }
        for (key in this) {
            console.log(key);
            Class[key] = this[key]
        }
        for (key in proto) {
            Class.prototype[key] = proto[key]
        }

        for (var key in object) {
            Class.prototype[key] = object[key]
        }
        return Class;
    }

    return Core;
}();
