DragNDrop = Ember.Namespace.create();

DragNDrop.cancel = function(event) {
  console.log('cancel')
  event.preventDefault();
  return false;
};
DragNDrop.blank = function(){
  return true;
};

DragNDrop.DragAndDroppable = Ember.Mixin.create({
  layoutName:'DragAndDroppable',
  attributeBindings: 'draggable',
  dragEnter: DragNDrop.cancel,
  dragOver: DragNDrop.cancel,
  draggable: 'true',
  dragStart: DragNDrop.cancel,
  drop:DragNDrop.cancel
});


DragNDrop.DropTarget = Ember.Mixin.create({
  dragEnter: DragNDrop.blank,
  dragOver: DragNDrop.blank,
  dragStart: DragNDrop.blank,
  drop:DragNDrop.blank
});

App.PopupOpenerMixin = Ember.Mixin.create({
  actions:{
    openModal:function(modalName,model,secondaryModel){
      return true;
    },
    openModalSource:function(modalName,model,secondaryModel){
      if(this.sendAction){
        return this.sendAction('openModal',modalName,model,secondaryModel);
      }
      else this.send('openModal',modalName,model,secondaryModel);
    }
  },
  openModalFunction:function(modalName,model,secondaryModel){
    if(this.sendAction){
      return this.sendAction('openModalSource',modalName,model,secondaryModel);
    }
    else this.send('openModalSource',modalName,model,secondaryModel);
  }
});

App.PluginPopupOpenerMixin = Ember.Mixin.create({
  actions:{
    openModalPlugin:function(modalName,model,secondaryModel){
      this.get('targetObject').openModalFunction.call(this.get('targetObject'),modalName,model,secondaryModel)
    }
  }
});