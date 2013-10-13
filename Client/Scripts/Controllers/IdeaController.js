App.IdeaController = Ember.ObjectController.extend({
    actions:{
    },
    position:function(){
        return 'left:' + this.get('model').get('left') + 'px;top:' + this.get('model').get('top') + 'px';
    }.property('model.left'),
    linkCount: function () {
        this.get('model').get('test');
        var links = this.get('model').get('links');
        links.forEach(function (element) {
            console.log('lINK');
        });
        return links.length;
    }.property("model.links"),
    documentCount: function () {
        return this.get('model').get('documents').length;
    }.property("model.documents"),
    commentCount: function () {
        return this.get('model').get('comments').length;
    }.property("model.comments")


});