App = Ember.Application.create({

  ready: function () {
    var token = $.urlParam('token');
    if (token) {
      $.cookie(AppSettings.CookieName, token);
      window.location = 'http://'+AppSettings.domain+'/'
    }
    token = $.cookie(AppSettings.CookieName);
    if(!token){
      window.location = 'http://'+AppSettings.domain+'/login.html'
    }

    App.ApplicationAdapter = DS.RESTAdapter.extend({
      //  namespace: 'api',
      host: AppSettings.WebserviceURL,
      headers: { 'Authorization': token },
      // defaultSerializer: 'App/appacitiveREST'
    });
  }
});

DragNDrop = Ember.Namespace.create();

DragNDrop.cancel = function(event) {
  console.log('cancel')
  event.preventDefault();
  return false;
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

App.PopupMixin = Ember.Mixin.create({
  openPopup:false,
  SubscribePopup:function(context,content){
    Ember.subscribe(this.toString(), {
      after: function(name, timestamp, payload) {
        context.get('openPopup')? context.set('openPopup', false): context.set('openPopup', true);
        if(content){
          context.get(content)? context.set(content, false): context.set(content, true);
        }
      }
    });
  },
  TogglePopup:function(content){
    this.get('openPopup')? this.set('openPopup', false): this.set('openPopup', true);
    if(content){
      this.get(content)? this.set(content, false): this.set(content, true);
    }
  }
});
                                    /*
App.ApplicationSerializer = DS.RESTSerializer.extend({
  serializeHasMany: function(record, json, relationship) {
    var key = relationship.key;

    // don't care which kind of hasMany relationship this is
    json[key] = get(record, key).mapBy('id');
  }
});*/
'use strict';
App.Router.map(function () {
  this.resource('settings', { path: '/settings' }, function () {
    this.route('profile');
  });
  this.resource('card', { path: '/card/:card_id' });
  this.resource('cards', { path: '/cards' }, function () {
    this.route('index');
  });
  this.resource('emails', { path: '/emails' }, function () {
    this.route('index');
  });
  this.resource('links', { path: '/links' }, function () {
    this.route('index');
  });
  this.resource('template', { path: '/template/:template_id' });
  this.resource('templates', { path: '/templates' }, function () {
    this.route('index');
  });
});

App.ApplicationRoute = Ember.Route.extend({
  actions: {
    openModal: function(modalName, model) {
      this.controllerFor(modalName).set('model', model);
      return this.render(modalName, {
        into: 'application',
        outlet: 'modal'
      });
    },

    closeModal: function() {
      return this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    }
  },
  model: function () {
    var sessionToken = $.cookie(AppSettings.CookieName);
    var m = this.store.find('application', sessionToken)
    return m;
  },
  setupController: function(controller, model) {
    controller.SubscribeToContextMenuEvents();
    controller.set('model', model);
  }
});

App.IndexRoute = Ember.Route.extend({
  model: function () {
    return this.modelFor('cards');
  }
});

App.CardsRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('card');
  },
  setupController: function(controller, model) {

    var ret =this.store.all('template').map(function(item, index, enumerable){
      return {id:item.get('id'),title:item.get('title')}
    });
    ret.push({title:'None',id:-1})
    ret.sort(function compare(a, b) {
      if (a.id<b.id){
        return -1;
      }
      if (a.id>b.id){
        return 1;
      }
      // a must be equal to b
      return 0;
    })
    console.log(ret)
    controller.set('templates',ret);
  }
});

App.CardsIndexRoute = Ember.Route.extend({
  model: function () {
    return this.modelFor('cards');
  }
});

App.TemplatesRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('template');
  }
});

App.TemplatesIndexRoute = Ember.Route.extend({
  model: function () {
    return this.modelFor('templates');
  }
});

App.EmailsRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('email');
  }
});

App.EmailsIndexRoute = Ember.Route.extend({
  model: function () {
    return this.modelFor('email');
  }
});

App.SettingsRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('setting',0);
  },
  setupController: function(controller, model) {
    console.log(model)
  }
});

App.SettingsIndexRoute = Ember.Route.extend({
  model: function () {
    console.log('QQQQQQQ')
    return this.modelFor('settings');
  }
});

App.CardRoute = Ember.Route.extend({
  actions: {
    openModal: function(modalName, model) {
      return true
    },

    closeModal: function() {
      return this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    }
  }
});


'use strict';
window.AppSettings =
  {
    WebserviceURL: 'http://localhost:4730',
    domain:window.location.host,
    CookieName: 'App',
    OAuthRedirect: function (url) {
    $.ajax({
    settings: {
    async: false
  },
    url: url,
      context: this,
        success: function (data, textStatus, jqXHR) {
          window.location = data;
        },
          dataType: 'json',
            type: 'GET'
});
}

}
'use strict';
App.ApplicationController = Ember.Controller.extend({
    currentDrag: null,
    menuOpen:false,
    actions: {
        ClearToken: function () {
            $.cookie(AppSettings.CookieName, '', { expires: -1 });
        },
        StartDrag:  function(){
            return function (model) {
                this.set('currentDrag', model);
            };
        },
    },
    MouseMove: function (application) {
        var controller = application;
         function mouseMove (event) {
             console.log(controller.get('currentDrag'));
             console.log(application.get('currentDrag'));
         }
         return mouseMove;
    },
   SubscribeToContextMenuEvents:function(){
      Em.subscribe('contextMenu.open',this.get('MouseMove')(this.get('model')));
   },
   ToggleContextMenu: function (model) {
      return {
        before: function(name, timestamp, event) {
        },
        after: function(name, timestamp, event, beforeRet) {
        }
      };
   },
   SetContextType: function (model) {
      return {
        before: function(name, timestamp, event) {
        },
        after: function(name, timestamp, event, beforeRet) {
        }
      };
   }
});
'use strict';
App.CardController = Ember.ObjectController.extend({
  word:'hello',
  actions:{
    Delete:function(){
      this.get('store').find('card', this.get('model').get('id')).then(function(rec){
        rec.deleteRecord();
        rec.save();
      });
    },
    ToggleEdit:function(){
      console.log('editing')
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
    },
    Share:function(){
    },
    SaveAsTemplate:function(){
      var template = {
        title:this.get('model').get('title'),
        sectionsIn: this.get('model').get('sections').getEach('id')
      }
      template = this.store.createRecord('template', template);
      var otherSections =this.get('model').get('sections')
      template.get('sections').then(function(sections){
        sections.pushObjects(otherSections);
        template.save();
      })
    },
    CreateSection: function(){
      console.log(this.get('model').get('id'))
      var section = this.store.createRecord('section', {
        title: 'tester',
        type : 'Links',
        position:'0'
      });
      section.save().then(function(section){
        this.get('model.sections').then(function(sections){
          sections.push(section);
        })
        this.get('model').save();
      });
    },
    openModal:function(modalName){
     return true;
    }
  },
  close:function(card){
    console.log('card closing');
  },
  IsRight:function(){
    console.log('right')
    console.log(this.get('section'))
    return true;
  }.property(),
  sortSomeAttachments:function(){
  console.log('sorting')
  var attachments = this.get('model').get('attachments');
  var tags = this.get('model').get('tags');
  var tit = this.get('model').get('title');
  return '';
}.observes('model.attachments.@each.type'),
                                                   position:function(){
  return 'left:' + this.get('model').get('left') + 'px;top:' + this.get('model').get('top') + 'px';
}.property('model.left'),




  /* linkCount: function () {
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


      sortAttachments:function(){


      if()
    }
  },
  */
});
'use strict';
App.CardsController = Ember.ArrayController.extend({
   templates:'?',
   test:function(){
   }
});
'use strict';
App.NewSectionController = Ember.ObjectController.extend({
  types:['Links','Documents','Questions','Tasks','Properties','TextArea','Card'],
  selectedType:null,
  actions:{
    Submit: function(){
      console.log(this.get('model.id'));
      var section = this.store.createRecord('section', {
        title: this.get('newTitle'),
        type : this.get('selectedType'),
        position:this.get('model.sections.length')
      });
      var card = this.get('model');
      section.set('card',card);
      this.get('model.sections').then(function(sections){
        section.save().then(function(section){
          sections.pushObject(section);
          card.save();
        });
      });
      this.send('close')
    },
    close: function() {
      return this.send('closeModal');
    }
  }
});
'use strict';
App.SectionController = Ember.ObjectController.extend({
  isEditing:false,
  isLinks:Ember.computed.equal('model.type', 'Links'),
  isProperties:Ember.computed.equal('model.type', 'Properties'),
  isQuestions:Ember.computed.equal('model.type', 'Questions'),
  isTasks:Ember.computed.equal('model.type', 'Tasks'),
  isTextArea:Ember.computed.equal('model.type', 'TextArea'),
  isCard:Ember.computed.equal('model.type', 'Card'),
  isCollapsed:Ember.computed.bool('model.collapsed'),
    actions:{
      ToggleEdit:function(){

        this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
      },
        deleteSection:function(){
          var model = this.get('model');
          model.deleteRecord();
          model.save()
        },
          collapse:function(){
            var model = this.get('model');
            model.get('collapsed')? model.set('collapsed', false): model.set('collapsed', true);
            model.save();
            return false;
          },
            UpdateSection:function(){
              this.get('model').save();
              this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
            }
    },
      close:function(){
        this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
      },
        chevron:function(){
          var model = this.get('model');
          if(model.get('collapsed')){
            return 'glyphicon glyphicon-chevron-up';
          }else{
            return 'glyphicon glyphicon-chevron-down';
          }
        }.property('model.collapsed')

   });
'use strict';
App.WallView = Ember.View.extend(Ember.Evented, {
    layoutName : 'canvas',
    mouseMove: function (event) {
      console.log('mouseMoveEvent');
        Em.instrument('mouse.move',event,function(){},this)
       // this.trigger('movement', event);
    },
    mouseLeave: function (event) {
      //  console.log('mouseOut');
    },
    didInsertElement: function (arg1, arg2) {
      var model = this.get('controller').get('model')
      model.forEach(function(element){
        console.log(element.get('title'))
      })
       // var element = $(".containezr").zoomTo({ targetsize: 0.75, duration: 600 });
    }
    //// didInsertElement$(this)
});

/*
        Em.instrument("student.here", this.get('content'), function() {
            //mark student as in attendance
            this.set('inAttendance', !this.get('inAttendance'));
        }, this)

      {{outlet}}
</div>
*/

'use strict';
App.ContextMenuView = Ember.View.extend({
   layoutName : 'contextMenu',
   contextMenu:function(event){
     console.log()
     var payload = {
       type:this.get('target'),
       x:event.clientX,
       y:event.clientY
     }
     Em.instrument('contextMenu.open',payload,function(){},this)
     return false;
   }
 })
'use strict';
App.DraggableCardView = Ember.View.extend({
  layoutName: 'draggablecard',
  subscription:null,
  mouseDown:function(event){
    var model = this.get('controller').get('model');
    this.set('subscription',Em.subscribe('mouse',this.get('MouseMove')(model)));
    return false;
  },
  mouseUp:function(event){
    var model = this.get('controller').get('model');
    Ember.Instrumentation.unsubscribe(this.get('subscription'));
    model.save();
    return false;
  },
  MouseMove: function (model) {
    return {
      model: model,
      x : -1,
      y : -1,
      before: function(name, timestamp, event) {
        console.log(this.x)
        console.log(event.clientX)
       if(this.model.get('left') === null){
          this.model.set('left',0);
          this.model.set('top',0);

        }
        if (this.x === -1) {
          this.x = event.clientX;
          this.y = event.clientY;
          return;
        }
        var diffX = this.x - event.clientX;
        var diffY = this.y - event.clientY;
        var left = parseInt(this.model.get('left'),10);
        var top = parseInt(this.model.get('top'),10);
        console.log(left-diffX)
        this.model.set('left', left-diffX);
        this.model.set('top', top - diffY);
        this.x = event.clientX;
        this.y = event.clientY;
      },
      after: function(name, timestamp, event, beforeRet) {
      }
    }
  }
});
'use strict';
App.DropCube = Ember.View.extend({
  templateName:'Qube',
  click:function(e){
    console.log('clicked')
  },
  dragEnter: DragNDrop.cancel,
  dragOver: DragNDrop.cancel,
  drop: function(event) {
    if(event.originalEvent.dataTransfer.getData('Type') === 'Attachment'){
     this.store.find('attachment',event.originalEvent.dataTransfer.getData('id')).then(function(obj){
        obj.deleteRecord();
        obj.save();
      })

    }
    event.preventDefault();
    return false;
  }
})
'use strict';
App.DropDelete = Ember.View.extend({
 /* layoutName:'dropDelete',
  drop:function(e){
    console.log('drop deleted AS HELL')
  },
  click:function(e){
    console.log('clicked')
  },
  dragEnter:function(e){console.log('entered Drop Delete')},
  dragLeave:function(e){console.log('left Drop Delete')},*/
})
'use strict';
App.Dropable = Ember.View.extend({
  layoutName:'dropDelete',
  /*drop:function(e){
    console.log('dropable')
  },
  click:function(e){
    console.log('clicked')
  },
  dragEnter:function(e){console.log('entered dropable')},
  dragLeave:function(e){console.log('left dropable')},*/
})
'use strict';
App.PopupView = Ember.View.extend({
  layoutName : 'popup',
  actions:{
    close:function(){
      var event = 'event'
      Em.instrument('mouse.move',event,function(){},this)
      console.log('close')
    }
  },
  didInsertElement: function (arg1, arg2) {
    var close = onClose(this.get('context'))
    $('#popup').bPopup({
      closeClass:'close',
     // onClose: close
    });
    Ember.subscribe('popup.close', {
      after: function(name, timestamp, payload) {
        close();
      }
    });
  }
});

function onClose(context){
  function togglePopup(){
      Ember.instrument(context.toString(), {}, function() {
      });
  }
  return togglePopup;
}
'use strict';
App.TaggerView = Ember.View.extend({
  templateName: 'TaggerView',
  tagger : null,
  didInsertElement: function () {
    this.tagger = new Tagger($('#tags'), {
      source: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
    });
  },
  getTags:function(){
    return this.tagger.getTags();
  }
});

/*

        this.To = new Tagger($('#test2'), {
            source: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Dakota", "North Carolina", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
        });

                this.tagger = new Tagger($('#tags'), {
            source: function (partialTag, proxy) {
                $.ajax({
                    method: "get",
                    url: "api/Tags/TagSearch?partialTag=" + partialTag,
                    success: proxy
                });
            },
            processReturn: function (data) {
                if (data.Name) {
                    return data.id;
                } else {
                    return data
                };
            },
            property: 'Name'
        });



*/
'use strict';
App.Application = DS.Model.extend({
   token: DS.attr('string'),
   name: DS.attr('string')
    //user: DS.belongsTo('user'),
});

'use strict';
App.Card = DS.Model.extend({
  title: DS.attr('string'),
  left: DS.attr('number'),
  top: DS.attr('number'),
  user: DS.belongsTo('user', { async: true }),
  attachments: DS.hasMany('attachment',{async:true}),
  sections: DS.hasMany('section',{async:true}),
  tags:DS.hasMany('tag',{async:true}),
  tagsIn:DS.attr(),
 // template:DS.attr()
});

'use strict';
App.Comment = DS.Model.extend({
    body: DS.attr('string'),
    idea: DS.belongsTo('Card'),
    user: DS.belongsTo('user')
});
'use strict';
App.Document = DS.Model.extend({
    title: DS.attr('string'),
});
'use strict';
App.Email = DS.Model.extend({
    from: DS.attr('string'),
    title: DS.attr('string'),
    body: DS.attr('string')
});

'use strict';
App.Link = DS.Model.extend({
  title: DS.attr('string'),
  href: DS.attr('string'),
  user: DS.belongsTo('user', { async: true }),
 // cards: DS.hasMany('card',{ async: true }),
  tags: DS.hasMany('tag',{ async: true })
});


'use strict';
App.Payload = DS.Model.extend({
   data: DS.attr('string'),
   name: DS.attr('string')
    //user: DS.belongsTo('user'),
});

'use strict';
App.Section = DS.Model.extend({
   title: DS.attr('string'),
   attachments: DS.hasMany('attachment',{async:true}),
   type: DS.attr('string'),
   position: DS.attr('number'),
   card:DS.belongsTo('card'),
   collapsed:DS.attr('boolean')
    //user: DS.belongsTo('user'),
});

'use strict';
App.Setting = DS.Model.extend({
  name: DS.attr('string'),
  email: DS.attr('string'),
  facebook: DS.attr('boolean'),
  google: DS.attr('boolean'),
});

'use strict';
App.Template = DS.Model.extend({
  title: DS.attr('string'),
  user: DS.belongsTo('user', { async: true }),
  sections: DS.hasMany('section',{async:true}),
  tags:DS.hasMany('tag',{async:true}),
  sectionsIn:DS.attr()
});

'use strict';
App.User = DS.Model.extend({
  name: DS.attr('string'),
  email: DS.attr('string'),
  profileImg: DS.attr('string'),
  firstname: DS.attr('string')
});

'use strict';
App.Attachment = DS.Model.extend({
  data:DS.attr(),
  section:DS.belongsTo('section'),
  sectionid:DS.attr(),
  tags:DS.hasMany('tag'),
  cardsIn:DS.attr(),
  tagsIn:DS.attr(),
  type:DS.attr('string')
})
'use strict';
App.Tag = DS.Model.extend({
  title: DS.attr('string')
});

'use strict';
App.BaseSectionComponent = Ember.Component.extend(App.PopupMixin,{
  section:null,
  isEditing:false,
  submitAttachment:function(data){
    var attachment =  {
      data: data,
      sectionid: this.get('section').get('id'),
      type:this.get('section').get('type')
    };
    var context = this;
    attachment = this.store.createRecord('attachment', attachment);
    this.store.find('section',this.get('section').get('id')).then(function(section){
      context.get('section.attachments').then(function(attachments){
        attachment.save().then(function(attachment){
          attachments.pushObject(attachment);
          section.save();
        });
      });
    });
  },
});

'use strict';
App.CardControllsComponent = Ember.Component.extend(App.PopupMixin,{
  edit:false,
  share:false,
  section:false,

  actions:{
    onDelete:function(){
    },
    onShare:function(){
      this.get('section') ? this.set('section',false):this.set('section',true);
    },
    onEdit:function(){
      this.get('section') ? this.set('section',false):this.set('section',true);
    },
    onAddSection:function(){
      this.TogglePopup('section');
      //this.get('section') ? this.set('section',false):this.set('section',true);
    },
    openModal:function(modalName,model){
      return this.sendAction('openModal',modalName,model);
    }
  },
  didInsertElement:function(){
    this.SubscribePopup(this,'section');
  },

});
'use strict';
App.CardFormComponent = Ember.Component.extend({
  title:null,
  description:null,
  store: null,
  actions:{
    Submit: function(){
      var tags = this.get('tagger').getTags();
      var card = this.store.createRecord('card', {
        title: this.get('title'),
        description: this.get('description'),
        left:0,
        top:0,
        tagsIn : tags
      });
      card.save();
      this.set('title','');
      this.set('description','');
    }
  },
});
'use strict';
App.CardMainComponent = Ember.Component.extend({
  isFocoused: false,
  eventID: -1,
  dragFunction:null,
  editing:false,
  subscription:null,
  actions: {
    StartDrag: function (application) {
      console.log('drag');
      this.subscription = Em.subscribe('mouse',this.get('MouseMove')(this.get('model')));
    },
    StopDrag: function (model) {
      model.save();
      Ember.Instrumentation.unsubscribe(this.get('subscription'));
    },
    focus: function () {
      this.set('isFocoused', this.get('isFocoused') ? false : true);
      console.log(this.get('isFocoused'));
    },
    ToggleEdit : function(){
      var ed =this.get('editing');
      this.set('editing', this.get('editing') ? false : true);
      return false;
    },
    Delete: function(){
      console.log('delete');
      var card = this.get('model');
      card.deleteRecord();
      card.save();
    }
  },
  MouseMove: function (model) {
    return {
      model: model,
      x : -1,
      y : -1,
      before: function(name, timestamp, event) {
        console.log(this.x);
        console.log(event.clientX);
        if(this.model.get('left') === null){
          this.model.set('left',0);
          this.model.set('top',0);
        }
        if (this.x == -1) {
          this.x = event.clientX;
          this.y = event.clientY;
          return;
        }

        var left = parseInt(this.model.get('left'),10);
        var top = parseInt(this.model.get('top'),10);
//        console.log(left-diffX);

        this.x = event.clientX;
        this.y = event.clientY;
      },
      after: function(name, timestamp, event, beforeRet) {
      }
    };
  }
});

App.CardFormComponent = Ember.Component.extend({
  title:null,
  description:null,
  store: null,
  actions:{
    Submit: function(){
      var tags = this.get('tagger').getTags();
       var data = {
        title: this.get('title'),
        left:0,
        top:0,
        tagsIn : tags
      };

      if(this.get('selectedTemplate')>0){
        data.template = this.get('selectedTemplate');
      }
      var card = this.store.createRecord('card', data);
      card.save();
      this.set('title','');
      this.set('description','');

    }
  },
});
'use strict';
App.ModalDialogComponent = Ember.Component.extend({
  actions: {
    close: function() {
      return this.sendAction();
    }
  }
});
'use strict';
App.SectionFormComponent = Ember.Component.extend({
  types:['Links','Documents','Questions','Tasks','Properties','TextArea','Card'],
  selectedType:null,
  actions:{
    Submit: function(){
      console.log(this.get('card').get('id'));
      var section = this.store.createRecord('section', {
        title: this.get('title'),
        type : this.get('selectedType'),
        position:this.get('card').get('sections.length')
      });
      var card = this.get('card');
      section.set('card',this.get('card'));
      this.get('card.sections').then(function(sections){
        section.save().then(function(section){
          sections.pushObject(section);
          card.save();
        });
      });
      Ember.instrument('popup.close', {}, function() {
      });
    }
  }
});
'use strict';
App.SideBarComponent = Ember.Component.extend({
  Active:false,
  CurrentForm:'',
  card:false,
  link:false,
  actions:{
    NewCard: function(){
      this.get('Active') ? this.set('Active',false) : this.set('Active',true);
      this.set('card',true);
      this.set('link',false);
    },
    NewLink: function(){
      this.get('Active') ? this.set('Active',false) : this.set('Active',true);
      this.set('card',false);
      this.set('link',true);
    }
  },
  DisplayForm:function(){
    if(this.get('Active')){
      return 'display:block;';
    }else{
      return 'display:none;';
    }
  }.property('Active')
});
'use strict';
App.TasksMainComponent = App.BaseSectionComponent.extend({
  title:'Tasks',
  actions:{
    CreateTask:function(){
      var data = {
        title:this.get('newTask'),
      };
      this.submitAttachment(data);
      this.set('newTask','');
    }
  },
  willInsertElement:function(){
  }
});
'use strict';
App.TitleCardComponent = Ember.Component.extend({
  actions:{
    onDelete:function(){
    },
    onShare:function(){
      this.get('section') ? this.set('section',false):this.set('section',true);
    },
    onEdit:function(){
      this.get('section') ? this.set('section',false):this.set('section',true);
    },
    onAddSection:function(){
      this.get('section') ? this.set('section',false):this.set('section',true);
    },
    Save:function(){
      console.log(this.get('model.title'));
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
      this.get('store').find('Card',this.get('model.id')).then(function(card){
        card.save();
      });
    },
  }
});
'use strict';
App.LinkController = Ember.Controller.extend({
  isEditing:false,
  actions: {
    del: function () {
      var model = this.get('model');
      model.deleteRecord();
      model.save();
    },
    edit:function(){
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
      }
    },
})
'use strict';
App.LinkView = Ember.View.extend(DragNDrop.DragAndDroppable,{
  dragStart: function(event) {
    console.log('dragStart');
    var model = this.get('model')
    var dataTransfer = event.originalEvent.dataTransfer;
    dataTransfer.setData('Type', 'Attachment');
    dataTransfer.setData('AttachmentType', 'link');
    dataTransfer.setData('id', model.get('id'));
  }
});
'use strict';
App.LinksMainComponent = App.BaseSectionComponent.extend({
  isEditing:false,
  title:'Links',
  actions:{
    edit:function(){
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
      console.log(this.get('popup'))
    },
    Submit: function(){
      //title to be set server side

      var href = this.get('newLink');
      if(this.urlIsWellFormed(href)){
        var data =
          {
            link:href
          }
        this.submitAttachment(data);
        this.set('newLink','');
      }else{
        //TODO : Implement form validation erros
        console.log('error')
      }
      //protocol index 2 //domain index 3
    }
  },
  urlIsWellFormed:function(url){
    var regex = /^((http[s]?|ftp[s]):\/)?\/?([^:\/\s]*)/
    var result = regex.exec(url);
    if(!result[2]){
      return false;
    }
    if(!result[3]){
      return false;
    }
    return true;
  }
});

'use strict';
App.PropertyController = Ember.ObjectController.extend({
    isNediting:false,
    isVediting:false,
    actions:{
      toggleV:function(){this.get('isVediting')? this.set('isVediting', false): this.set('isVediting', true);},
      toggleN:function(){this.get('isNediting')? this.set('isNediting', false): this.set('isNediting', true);},
    },
  close:function(){
    console.log('closing')
  }
});
'use strict';
App.PropertyFormComponent = App.BaseSectionComponent.extend({
  types:['string','number'],
  actions:{
      CreateProperty:function(){
      var data = {
        name:this.get('name'),
        value:this.get('value'),
        type:this.get('selectedType')
      }
      this.submitAttachment(data);
      this.set('name','');
      this.set('value','');
    }
  }
});
'use strict';
App.PropertyMainComponent = App.BaseSectionComponent.extend({
  didInsertElement:function(){
    console.log(this.toString());
    this.SubscribePopup(this);
  },
  context:function(){
    return this
  }.property(),
});
'use strict';
App.PropertyView = Ember.View.extend(DragNDrop.DragAndDroppable,{
  templateName:'property',
  dragStart: function(event) {
    console.log('dragStart');
    var model = this.get('model')
    var dataTransfer = event.originalEvent.dataTransfer;
    dataTransfer.setData('Type', 'Attachment');
    dataTransfer.setData('AttachmentType', 'Property');
    dataTransfer.setData('id', model.get('id'));
  }
});
'use strict';
App.QuestionController = Ember.ObjectController.extend({
   displayAnswer : false,
   class:'panel-collapse collapse in',
   actions:{
     UpdateQuestion:function(){
       console.log(this.get('model').get('data').answer)
       this.get('model').save();
       this.get('isEditingAnswer')? this.set('isEditingAnswer', false): this.set('isEditingAnswer', true);
     },
     ToggleAnswer:function(){
        this.get('displayAnswer')? this.set('displayAnswer', false): this.set('displayAnswer', true);
     },
     ToggleEditAnswer:function(){
       this.get('isEditingAnswer')? this.set('isEditingAnswer', false): this.set('isEditingAnswer', true);
     },
     NewAnswer:function(){
        this.get('model').get('data').answer = this.get('answer');
        this.get('model').save();
        this.get('isEditingAnswer')? this.set('isEditingAnswer', false): this.set('isEditingAnswer', true);
     }
   },
   answerClass:function(){
     if(this.get('displayAnswer')){
       return 'panel-collapse collapse in'
     }
     return 'panel-collapse collapse out'
   }.property('displayAnswer')
});
'use strict';
App.QuestionMainComponent = App.BaseSectionComponent.extend({
  layoutName:'cardview',
  title:'Questions',
  actions:{
    CreateQuestion:function(){
      var data={
        question:this.get('newQuestion')
      }
      this.submitAttachment(data);
      this.set('newQuestion','')
    },
    ToggleEdit:function(){
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
    }
  },
  willInsertElement:function(){
    console.log('setting Up');
    console.log(this.get('layoutName'));
    this.set('layoutName','cardview');
  }
});
'use strict';
App.TaskController = Ember.ObjectController.extend({
  actions:{
    Start:function(){

    },
    Stop:function(){

    },
    Hover:function(){
      console.log('enter')
    }
  }
})
'use strict';
App.TasksMainComponent = App.BaseSectionComponent.extend({
  title:'Tasks',
  actions:{
    CreateTask:function(){
      var data = {
        title:this.get('newTask'),
      }
      this.submitAttachment(data);
      this.set('newTask','');
    }
  },
  willInsertElement:function(){
  }
});
'use strict';
App.TextAreaComponent = App.BaseSectionComponent.extend({
  text:null,
  newText:null,
  hasText: Ember.computed.gt('data.length',0),
  isEditing:false,
  actions:{
    ToggleEdit:function(){
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
    },
    NewMultiLineText:function(){
      console.log(this.get('data'));
      var data = {
        value:this.get('newText'),
      }
      this.submitAttachment(data);
      this.set('text',this.get('newText'));
    },
  Update:function(){
      var data = {
        value:this.get('text'),
      }
      //updateAttachment
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
    }
  },
})