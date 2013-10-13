App.IdeaController = Ember.ObjectController.extend({
    needs: "application",
    isFocoused: false,
    isDragging: false,
    eventID: -1,
    dragFunction:null,
    actions:{
        model:function(){
            console.log(this.get('model').get('title'));
        },
        StartDrag: function (application) {
            this.set('dragFunction', this.get('MouseMove')(this.get('model')));
            App.CanvasView.on('movement', this.get('dragFunction'));
        },
        StopDrag: function (application) {
           // application.set('currentDrag', null);
            // console.log(application.get('currentDrag'));
            App.CanvasView.off('movement',this.get('dragFunction'));
        },
        focus: function () {
            this.set('isFocoused', this.get('isFocoused') ? false : true);
            console.log(this.get('isFocoused'));  
        }
    },
    MouseMove: function (model) {
        var model = model;
        var x = -1;
        var y = -1;
        function dragIdea(event) {
            if (x == -1) {
                x = event.clientX;
                y = event.clientY;
                return;
            }
            var diffX = x - event.clientX;
            var diffY = y - event.clientY;
            var left = parseInt(model.get('left'),10);
            var top = parseInt(model.get('top'),10);
            model.set('left', left-diffX);
            model.set('top', top - diffY);
            x = event.clientX;
            y = event.clientY;
        }
        return dragIdea;
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