App.IdeaMainComponent = Ember.Component.extend({
    isFocoused: false,
    eventID: -1,
    dragFunction:null,
    actions: {
        StartDrag: function (application) {
            this.set('dragFunction', this.get('MouseMove')(this.get('model')));
            App.CanvasView.on('movement', this.get('dragFunction'));
        },
        StopDrag: function (application) {
            App.CanvasView.off('movement', this.get('dragFunction'));
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
    }
});