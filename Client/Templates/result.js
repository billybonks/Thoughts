Ember.TEMPLATES["application"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options;
  data.buffer.push("\r\n      <li>");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "cards", options) : helperMissing.call(depth0, "link-to", "cards", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</li>\r\n      <li>");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "emails", options) : helperMissing.call(depth0, "link-to", "emails", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</li>\r\n      <li>");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "links", options) : helperMissing.call(depth0, "link-to", "links", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</li>\r\n      <li>");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "templates", options) : helperMissing.call(depth0, "link-to", "templates", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</li>\r\n      <li>");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(10, program10, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "settings", options) : helperMissing.call(depth0, "link-to", "settings", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</li>\r\n      ");
  return buffer;
  }
function program2(depth0,data) {
  
  
  data.buffer.push(" Cards");
  }

function program4(depth0,data) {
  
  
  data.buffer.push(" Emails");
  }

function program6(depth0,data) {
  
  
  data.buffer.push(" Links");
  }

function program8(depth0,data) {
  
  
  data.buffer.push(" Templates");
  }

function program10(depth0,data) {
  
  
  data.buffer.push(" Settings");
  }

function program12(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\r\n      <li><a href=\"#\">Welcome ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</a></li>\r\n      <li><button class=\"btn btn-danger btn-nav \"");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "ClearToken", {hash:{
    'on': ("click")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Logout</button></li>\r\n      ");
  return buffer;
  }

function program14(depth0,data) {
  
  var buffer = '', hashContexts, hashTypes;
  data.buffer.push("\r\n      <li><button class=\"btn btn-info btn-nav\"");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "LoginPopup", {hash:{
    'on': ("click")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Login</button></li>\r\n      ");
  return buffer;
  }

function program16(depth0,data) {
  
  
  data.buffer.push("\r\n<div class=\"card contextMenu\" style=\"left:100px;top:200px\">\r\n  <ul class=\"list-group\" style=\"margin: 0px;\">\r\n    <li class=\"list-group-item\">\r\n      Edit\r\n    </li>\r\n    <li class=\"list-group-item\">\r\n      Share\r\n    </li>\r\n    <li class=\"list-group-item\">\r\n      Delete\r\n    </li>\r\n  </ul>\r\n</div>\r\n");
  }

  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.outlet || depth0.outlet),stack1 ? stack1.call(depth0, "modal", options) : helperMissing.call(depth0, "outlet", "modal", options))));
  data.buffer.push("\r\n<nav class=\"navbar navbar-default\" style=\"position:fixed;width:100%\" role=\"navigation\">\r\n  <!-- Brand and toggle get grouped for better mobile display -->\r\n  <div class=\"navbar-header\">\r\n    <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-ex1-collapse\">\r\n      <span class=\"sr-only\">Toggle navigation</span>\r\n      <span class=\"icon-bar\"></span>\r\n      <span class=\"icon-bar\"></span>\r\n      <span class=\"icon-bar\"></span>\r\n    </button>\r\n    <a class=\"navbar-brand\" href=\"#\">Welcome</a>\r\n  </div>\r\n\r\n  <!-- Collect the nav links, forms, and other content for toggling -->\r\n  <div class=\"collapse navbar-collapse navbar-ex1-collapse\">\r\n    <ul class=\"nav navbar-nav\">\r\n      ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "model.token", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\r\n    </ul>\r\n    <ul class=\"nav navbar-nav navbar-right\">\r\n      ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "model.token", {hash:{},inverse:self.program(14, program14, data),fn:self.program(12, program12, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\r\n    </ul>\r\n  </div><!-- /.navbar-collapse -->\r\n</nav>\r\n\r\n<div class=\"row\" style=\"margin-bottom:50px\">\r\n  <div class=\"col-md-1\">\r\n    <h2 id=\"Timer\" style=\"margin:0px\"></h2>\r\n  </div>\r\n</div>\r\n");
  data.buffer.push("\r\n");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\r\n");
  data.buffer.push("\r\n");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "menuOpen", {hash:{},inverse:self.noop,fn:self.program(16, program16, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\r\n<div id=\"LoginOptions\" style=\"display:none;background-color:white\" class=\"col-md-9\">\r\n  <div class=\"modal-header\">\r\n    <h4>Log in</h4>\r\n  </div>\r\n\r\n\r\n  <div class=\"col-md-8\" style=\"margin-top:15px\">\r\n    <button class=\"btn btn-social facebook\" ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "LoginFacebook", {hash:{
    'on': ("click")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">With Facebook</button>\r\n    <button class=\"btn btn-social google\" ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "LoginGoogle", {hash:{
    'on': ("click")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">With Google</button>\r\n    <button class=\"btn btn-social github\" ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "LoginGithub", {hash:{
    'on': ("click")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">With GitHub</button>\r\n    <button class=\"btn btn-social twitter\" ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "Loginwitter", {hash:{
    'on': ("click")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">With Twitter</button>\r\n  </div>\r\n</div>\r\n\r\n");
  return buffer;
  
});

Ember.TEMPLATES["card"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\r\n        <span class=\"label label-success\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</span>\r\n      ");
  return buffer;
  }

  data.buffer.push("<div class=\"container\">\r\n  <div class=\"col-md-12\">\r\n    <div class=\"col-md-6\">\r\n      <div class=\"col-md-8\">\r\n      <h3>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</h3> by ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.user.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" <br />\r\n      ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "model.tags", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n        <button class=\"btn btn-default\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "SaveAsTemplate", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Save as tempalte</button>\r\n        ");
  hashContexts = {'store': depth0};
  hashTypes = {'store': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.DropCube", {hash:{
    'store': ("store")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\r\n      </div>\r\n\r\n      <div class=\"col-md-3\">\r\n        ");
  hashContexts = {'card': depth0,'store': depth0,'openModal': depth0};
  hashTypes = {'card': "ID",'store': "ID",'openModal': "STRING"};
  options = {hash:{
    'card': ("model"),
    'store': ("store"),
    'openModal': ("openModal")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['card-controlls'] || depth0['card-controlls']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "card-controlls", options))));
  data.buffer.push("\r\n      </div>\r\n    </div>\r\n    ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || depth0.render),stack1 ? stack1.call(depth0, "sections", "model.sections", options) : helperMissing.call(depth0, "render", "sections", "model.sections", options))));
  data.buffer.push("\r\n  </div>\r\n</div>\r\n");
  return buffer;
  
});

Ember.TEMPLATES["cards"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  data.buffer.push("\r\n");
  data.buffer.push("\r\n<div class=\"row\" style=\"margin-top:30px\">\r\n  <button type=\"button\" class=\"btn btn-default btn-sm\"  style=\"width:100px\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "NewCard", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\r\n    <span class=\"glyphicon glyphicon-plus\"></span> Card\r\n  </button>\r\n</div>\r\n<div >\r\n");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.WallView", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\r\n</div>");
  return buffer;
  
});

Ember.TEMPLATES["cards/CanvasVersion"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var stack1, hashContexts, hashTypes, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\r\n      ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.view.call(depth0, "App.DraggableCardView", {hash:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\r\n        <div class=\"controlls\">\r\n                    <div class=\"row\">\r\n                      <div class=\"col-md-1\">\r\n                        <button type=\"button\" class=\"btn btn-default btn-xs\" ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "Delete", {hash:{
    'on': ("mouseDown")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\r\n                          <span class=\"glyphicon glyphicon-remove\"></span>\r\n                        </button>\r\n                      </div>\r\n                    </div>\r\n                    <div class=\"row\">\r\n                      <div class=\"col-md-1\">\r\n                        <button type=\"button\" class=\"btn btn-default btn-xs\">\r\n                          <span class=\"glyphicon glyphicon-share-alt\"></span>\r\n                        </button>\r\n                      </div>\r\n                    </div>\r\n                    <div class=\"row\">\r\n                      <div class=\"col-md-1\">\r\n                        <button type=\"button\" class=\"btn btn-default btn-xs\"  ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "ToggleEdit", {hash:{
    'on': ("click")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\r\n                          ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "editing", {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n                        </button>\r\n                      </div>\r\n                    </div>\r\n        </div>\r\n        ");
  hashContexts = {'description': depth0,'title': depth0,'username': depth0,'tags': depth0,'idz': depth0};
  hashTypes = {'description': "ID",'title': "ID",'username': "ID",'tags': "ID",'idz': "ID"};
  options = {hash:{
    'description': ("description"),
    'title': ("title"),
    'username': ("user.name"),
    'tags': ("tags"),
    'idz': ("id")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['title-card'] || depth0['title-card']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "title-card", options))));
  data.buffer.push("\r\n      ");
  return buffer;
  }
function program3(depth0,data) {
  
  
  data.buffer.push("\r\n                          <span class=\"glyphicon glyphicon-check\"></span>\r\n                          ");
  }

function program5(depth0,data) {
  
  
  data.buffer.push("\r\n                          <span class=\"glyphicon glyphicon-edit\"></span>\r\n                          ");
  }

  hashContexts = {'itemController': depth0};
  hashTypes = {'itemController': "STRING"};
  stack1 = helpers.each.call(depth0, {hash:{
    'itemController': ("card")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
  
});

Ember.TEMPLATES["cards/index"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var stack1, hashContexts, hashTypes, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\r\n<div class=\"col-md-4\">\r\n  <div class=\"controlls\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-1\">\r\n        <button type=\"button\" class=\"btn btn-default btn-xs\" ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "Delete", {hash:{
    'on': ("mouseDown")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\r\n          <span class=\"glyphicon glyphicon-remove\"></span>\r\n        </button>\r\n      </div>\r\n    </div>\r\n    <div class=\"row\">\r\n      <div class=\"col-md-1\">\r\n        <button type=\"button\" class=\"btn btn-default btn-xs\">\r\n          <span class=\"glyphicon glyphicon-share-alt\"></span>\r\n        </button>\r\n      </div>\r\n    </div>\r\n    <div class=\"row\">\r\n      <div class=\"col-md-1\">\r\n        <button type=\"button\" class=\"btn btn-default btn-xs\"  ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "ToggleEdit", {hash:{
    'on': ("click")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\r\n          ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "editing", {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n        </button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n        ");
  hashContexts = {'model': depth0,'tags': depth0,'idz': depth0,'isEditing': depth0,'store': depth0};
  hashTypes = {'model': "ID",'tags': "ID",'idz': "ID",'isEditing': "ID",'store': "ID"};
  options = {hash:{
    'model': ("item"),
    'tags': ("tags"),
    'idz': ("id"),
    'isEditing': ("isEditing"),
    'store': ("store")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['title-card'] || depth0['title-card']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "title-card", options))));
  data.buffer.push("\r\n  </div>\r\n");
  return buffer;
  }
function program2(depth0,data) {
  
  
  data.buffer.push("\r\n          <span class=\"glyphicon glyphicon-check\"></span>\r\n          ");
  }

function program4(depth0,data) {
  
  
  data.buffer.push("\r\n          <span class=\"glyphicon glyphicon-edit\"></span>\r\n          ");
  }

  hashContexts = {'itemController': depth0};
  hashTypes = {'itemController': "STRING"};
  stack1 = helpers.each.call(depth0, "item", "in", "model", {hash:{
    'itemController': ("card")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
  
});

Ember.TEMPLATES["components/card-controlls"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashContexts, hashTypes, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"controlls\">\r\n  <div class=\"row\">\r\n    <div class=\"col-md-1\">\r\n      <button type=\"button\" class=\"btn btn-default btn-xs\" ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "Delete", {hash:{
    'on': ("mouseDown")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\r\n        <span class=\"glyphicon glyphicon-remove\"></span>\r\n      </button>\r\n    </div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"col-md-1\">\r\n      <button type=\"button\" class=\"btn btn-default btn-xs\">\r\n        <span class=\"glyphicon glyphicon-share-alt\"></span>\r\n      </button>\r\n    </div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"col-md-1\">\r\n      <button type=\"button\" class=\"btn btn-default btn-xs\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "openModalSource", "newSection", "card", {hash:{},contexts:[depth0,depth0,depth0],types:["STRING","STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\r\n        <span class=\"glyphicon glyphicon-plus\"></span>\r\n      </button>\r\n\r\n    </div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"col-md-1\">\r\n      <button type=\"button\" class=\"btn btn-default btn-xs\"  ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "ToggleEdit", {hash:{
    'on': ("click")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\r\n        <span class=\"glyphicon glyphicon-edit\"></span>\r\n      </button>\r\n    </div>\r\n  </div>\r\n</div>\r\n");
  return buffer;
  
});

Ember.TEMPLATES["components/card-form"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<form role=\"form\">\r\n  <div class=\"form-group\">\r\n    <label for=\"title\">Title</label>\r\n    ");
  hashContexts = {'type': depth0,'value': depth0,'class': depth0,'id': depth0,'placeholder': depth0};
  hashTypes = {'type': "STRING",'value': "ID",'class': "STRING",'id': "STRING",'placeholder': "STRING"};
  options = {hash:{
    'type': ("text"),
    'value': ("title"),
    'class': ("form-control"),
    'id': ("title"),
    'placeholder': ("Enter title")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\r\n  </div>\r\n  <div class=\"form-group\">\r\n    <label for=\"title\">Template</label>\r\n    ");
  hashContexts = {'class': depth0,'content': depth0,'optionValuePath': depth0,'optionLabelPath': depth0,'value': depth0};
  hashTypes = {'class': "STRING",'content': "ID",'optionValuePath': "STRING",'optionLabelPath': "STRING",'value': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'class': ("form-control"),
    'content': ("templates"),
    'optionValuePath': ("content.id"),
    'optionLabelPath': ("content.title"),
    'value': ("selectedTemplate")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\r\n  </div>\r\n\r\n  <div class=\"form-group\">\r\n    <label for=\"tags\">Tags</label>\r\n    ");
  hashContexts = {'viewName': depth0};
  hashTypes = {'viewName': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.TaggerView", {hash:{
    'viewName': ("tagger")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\r\n  </div>\r\n  <button type=\"submit\" class=\"btn btn-default\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "Submit", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Submit</button>\r\n</form>");
  return buffer;
  
});

Ember.TEMPLATES["components/document-main"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<div style=\"margin-bottom:10px\">\r\n  <div class=\"col-md-10\">\r\n    ");
  hashContexts = {'type': depth0,'class': depth0,'placeholder': depth0,'value': depth0,'action': depth0};
  hashTypes = {'type': "STRING",'class': "STRING",'placeholder': "STRING",'value': "ID",'action': "STRING"};
  options = {hash:{
    'type': ("text"),
    'class': ("form-control"),
    'placeholder': ("enter link press enter to submit"),
    'value': ("newTask"),
    'action': ("CreateTask")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\r\n  </div>\r\n  <div class=\"col-md-2\">\r\n    <button type=\"button\" class=\"btn btn-default btn-sm\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "edit", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\r\n      <span class=\"glyphicon glyphicon-plus\" ></span> New\r\n    </button>\r\n  </div>\r\n</div>");
  return buffer;
  
});

Ember.TEMPLATES["components/modal-dialog"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  data.buffer.push("\r\n<div class=\"overlay\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "close", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\r\n  <div class=\"modaler\" ");
  hashContexts = {'bubbles': depth0};
  hashTypes = {'bubbles': "BOOLEAN"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, {hash:{
    'bubbles': (false)
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\r\n    ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "yield", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\r\n  </div>\r\n</div>");
  return buffer;
  
});

Ember.TEMPLATES["components/section-form"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\r\n    <button type=\"submit\" class=\"btn btn-success\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "Submit", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Save</button>\r\n  ");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\r\n    <button type=\"submit\" class=\"btn btn-default\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "Submit", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Submit</button>\r\n  ");
  return buffer;
  }

  data.buffer.push("<form role=\"form\">\r\n  <div class=\"form-group\">\r\n    <label for=\"link\">Title</label>\r\n    ");
  hashContexts = {'type': depth0,'value': depth0,'class': depth0,'id': depth0,'placeholder': depth0};
  hashTypes = {'type': "STRING",'value': "ID",'class': "STRING",'id': "STRING",'placeholder': "STRING"};
  options = {hash:{
    'type': ("text"),
    'value': ("title"),
    'class': ("form-control"),
    'id': ("title"),
    'placeholder': ("Enter title")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\r\n  </div>\r\n  <div class=\"form-group\">\r\n    <label for=\"type\">Type</label>\r\n    ");
  hashContexts = {'content': depth0,'selectionBinding': depth0,'class': depth0};
  hashTypes = {'content': "ID",'selectionBinding': "ID",'class': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'content': ("types"),
    'selectionBinding': ("selectedType"),
    'class': ("form-control")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\r\n  </div>\r\n  ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "id", {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\r\n</form>");
  return buffer;
  
});

Ember.TEMPLATES["components/side-bar"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options;
  data.buffer.push("\r\n  <div class=\"col-sm-1\" style=\"margin-right:20pxpx;z-index:100;position:fixed;\">\r\n    <button type=\"button\" class=\"btn btn-default btn-sm\"  style=\"width:100%\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "NewCard", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\r\n      <span class=\"glyphicon glyphicon-plus\"></span> Card\r\n    </button>\r\n  </div>\r\n  <div class=\"col-md-4 sidebar-forms\" ");
  hashContexts = {'style': depth0};
  hashTypes = {'style': "ID"};
  options = {hash:{
    'style': ("DisplayForm")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(">\r\n    <div class=\"col-md-12\" >\r\n      ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "card", {hash:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\r\n      ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "link", {hash:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\r\n    </div>\r\n  </div>\r\n  ");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\r\n      ");
  hashContexts = {'store': depth0,'templates': depth0};
  hashTypes = {'store': "ID",'templates': "ID"};
  options = {hash:{
    'store': ("store"),
    'templates': ("templates")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['card-form'] || depth0['card-form']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "card-form", options))));
  data.buffer.push("\r\n      ");
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\r\n      ");
  hashContexts = {'store': depth0};
  hashTypes = {'store': "ID"};
  options = {hash:{
    'store': ("store")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['link-form'] || depth0['link-form']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "link-form", options))));
  data.buffer.push("\r\n      ");
  return buffer;
  }

  data.buffer.push("<div >\r\n  ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "store", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n</div>");
  return buffer;
  
});

Ember.TEMPLATES["components/title-card"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\r\n      ");
  hashContexts = {'type': depth0,'class': depth0,'value': depth0,'action': depth0};
  hashTypes = {'type': "STRING",'class': "STRING",'value': "ID",'action': "STRING"};
  options = {hash:{
    'type': ("text"),
    'class': ("form-control"),
    'value': ("model.title"),
    'action': ("Save")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\r\n      ");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options;
  data.buffer.push("\r\n      <h4>");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "card", "model.id", options) : helperMissing.call(depth0, "link-to", "card", "model.id", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</h4>\r\n      ");
  return buffer;
  }
function program4(depth0,data) {
  
  var hashTypes, hashContexts;
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  }

function program6(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\r\n    <span class=\"label label-success\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</span>\r\n    ");
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\r\n      <button class=\"btn btn-default\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "Save", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">save </button>\r\n    ");
  return buffer;
  }

  data.buffer.push("\r\n<div class=\"panel panel-default\" style=\"padding:20px\">\r\n  <div class=\"row borded\" >\r\n    <div class=\"col-md-8\">\r\n      ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "isEditing", {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n    </div>\r\n    <div class=\"col-md-4\">\r\n      <h4 style=\"float:right;\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.user.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</h4>\r\n    </div>\r\n  </div>\r\n  <div class=\"panel-body\"  >\r\n    ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "yield", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\r\n  </div>\r\n  <div class=\"panel-footer\" style=\"background-color: white;\">\r\n    ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "tags", {hash:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n    ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "isEditing", {hash:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n  </div>\r\n</div>");
  return buffer;
  
});

Ember.TEMPLATES["index"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("<div class=\"jumbotron\">\r\n  <h1>Engage !</h1>\r\n  <h1>With your work</h1>\r\n  <h1>Like never before!</h1>\r\n  <p>To learn more scroll down <span class=\"glyphicon glyphicon-arrow-down\"></span></p>\r\n  <p><button class=\"btn btn-default btn-lg\" onClick=\"redirectProvider('facebook')\">Login</button></p>\r\n</div>");
  
});

Ember.TEMPLATES["links"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\r\n  <tr>\r\n    ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "isEditing", {hash:{},inverse:self.program(5, program5, data),fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n\r\n    <td>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.href", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</td>\r\n    <td>");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "model.tags", {hash:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\r\n    <td><button type=\"button\" class=\"btn btn-danger\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "del", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Delete</button></td>\r\n    <td><button type=\"button\" class=\"btn btn-warning\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "edit", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Edit</button></td>\r\n\r\n  </tr>\r\n  ");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\r\n    <td>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\r\n      ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.view.call(depth0, "App.PopupView", {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n    </td>\r\n    ");
  return buffer;
  }
function program3(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\r\n      ");
  hashContexts = {'store': depth0,'id': depth0,'title': depth0,'link': depth0,'controller': depth0};
  hashTypes = {'store': "ID",'id': "ID",'title': "ID",'link': "ID",'controller': "ID"};
  options = {hash:{
    'store': ("store"),
    'id': ("model.id"),
    'title': ("model.title"),
    'link': ("model.href"),
    'controller': ("")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['link-form'] || depth0['link-form']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "link-form", options))));
  data.buffer.push("\r\n      ");
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\r\n    <td>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</td>\r\n    ");
  return buffer;
  }

function program7(depth0,data) {
  
  var hashTypes, hashContexts;
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  }

  data.buffer.push("<table class=\"table table-striped\">\r\n  <tr>\r\n    <th>Title</th>\r\n    <th>Url</th>\r\n    <th>Tags</th>\r\n    <th></th>\r\n    <th></th>\r\n  </tr>\r\n  ");
  hashContexts = {'itemController': depth0};
  hashTypes = {'itemController': "STRING"};
  stack1 = helpers.each.call(depth0, {hash:{
    'itemController': ("link")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n\r\n</table>\r\n\r\n\r\n");
  return buffer;
  
});

Ember.TEMPLATES["sections"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options;
  data.buffer.push("\r\n  ");
  data.buffer.push("\r\n    <div class=\"panel panel-default col-md-6\" style=\"padding:20px;display:inline-block\">\r\n      <div class=\"row borded\" >\r\n        <div class=\"col-md-10\">\r\n          ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "isEditing", {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n        </div>\r\n        <div class=\"pull-right\">\r\n          <span  ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "ID"};
  options = {hash:{
    'class': ("chevron")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "collapse", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("></span>\r\n          <span class=\"glyphicon glyphicon-remove\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "deleteSection", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("></span>\r\n        </div>\r\n      </div>\r\n      ");
  data.buffer.push("\r\n      <div class=\"panel-body\">\r\n        ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "isLinks", {hash:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\r\n        ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "isTask", {hash:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\r\n        ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "isDocument", {hash:{},inverse:self.noop,fn:self.program(10, program10, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\r\n        ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "isQuestions", {hash:{},inverse:self.noop,fn:self.program(12, program12, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\r\n        ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "isProperties", {hash:{},inverse:self.noop,fn:self.program(14, program14, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\r\n        ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "isTextArea", {hash:{},inverse:self.noop,fn:self.program(16, program16, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\r\n        ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "isCard", {hash:{},inverse:self.noop,fn:self.program(18, program18, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\r\n      </div>\r\n      ");
  data.buffer.push("\r\n    </div>\r\n  ");
  data.buffer.push("\r\n");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\r\n          ");
  hashContexts = {'type': depth0,'value': depth0,'size': depth0,'action': depth0};
  hashTypes = {'type': "STRING",'value': "ID",'size': "STRING",'action': "STRING"};
  options = {hash:{
    'type': ("text"),
    'value': ("section.title"),
    'size': ("50"),
    'action': ("UpdateSection")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\r\n          ");
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\r\n          <h4 ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "ToggleEdit", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</h4>\r\n          ");
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\r\n        ");
  hashContexts = {'openModal': depth0,'title': depth0,'model': depth0,'data': depth0,'card': depth0,'store': depth0};
  hashTypes = {'openModal': "STRING",'title': "ID",'model': "ID",'data': "ID",'card': "ID",'store': "ID"};
  options = {hash:{
    'openModal': ("openModal"),
    'title': ("section.title"),
    'model': ("section"),
    'data': ("section.attachments"),
    'card': ("card"),
    'store': ("store")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['links-main'] || depth0['links-main']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "links-main", options))));
  data.buffer.push("\r\n        ");
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\r\n        ");
  hashContexts = {'openModal': depth0,'title': depth0,'data': depth0,'model': depth0,'store': depth0};
  hashTypes = {'openModal': "STRING",'title': "ID",'data': "ID",'model': "ID",'store': "ID"};
  options = {hash:{
    'openModal': ("openModal"),
    'title': ("section.title"),
    'data': ("section.attachments"),
    'model': ("section"),
    'store': ("store")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['tasks-main'] || depth0['tasks-main']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "tasks-main", options))));
  data.buffer.push("\r\n        ");
  return buffer;
  }

function program10(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\r\n        ");
  hashContexts = {'openModal': depth0,'title': depth0,'data': depth0,'model': depth0,'store': depth0};
  hashTypes = {'openModal': "STRING",'title': "ID",'data': "ID",'model': "ID",'store': "ID"};
  options = {hash:{
    'openModal': ("openModal"),
    'title': ("section.title"),
    'data': ("section.attachments"),
    'model': ("section"),
    'store': ("store")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['document-main'] || depth0['document-main']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "document-main", options))));
  data.buffer.push("\r\n        ");
  return buffer;
  }

function program12(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\r\n        ");
  hashContexts = {'openModal': depth0,'title': depth0,'data': depth0,'model': depth0,'store': depth0};
  hashTypes = {'openModal': "STRING",'title': "ID",'data': "ID",'model': "ID",'store': "ID"};
  options = {hash:{
    'openModal': ("openModal"),
    'title': ("section.title"),
    'data': ("section.attachments"),
    'model': ("section"),
    'store': ("store")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['question-main'] || depth0['question-main']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "question-main", options))));
  data.buffer.push("\r\n        ");
  return buffer;
  }

function program14(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\r\n        ");
  hashContexts = {'openModal': depth0,'title': depth0,'data': depth0,'model': depth0,'store': depth0};
  hashTypes = {'openModal': "STRING",'title': "ID",'data': "ID",'model': "ID",'store': "ID"};
  options = {hash:{
    'openModal': ("openModal"),
    'title': ("section.title"),
    'data': ("section.attachments"),
    'model': ("section"),
    'store': ("store")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['property-main'] || depth0['property-main']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "property-main", options))));
  data.buffer.push("\r\n        ");
  return buffer;
  }

function program16(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\r\n        ");
  hashContexts = {'openModal': depth0,'title': depth0,'data': depth0,'model': depth0,'store': depth0};
  hashTypes = {'openModal': "STRING",'title': "ID",'data': "ID",'model': "ID",'store': "ID"};
  options = {hash:{
    'openModal': ("openModal"),
    'title': ("section.title"),
    'data': ("section.attachments"),
    'model': ("section"),
    'store': ("store")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['text-area'] || depth0['text-area']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "text-area", options))));
  data.buffer.push("\r\n        ");
  return buffer;
  }

function program18(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\r\n        ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "item", "in", "section.attachments", {hash:{},inverse:self.noop,fn:self.program(19, program19, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n        ");
  data.buffer.push("\r\n        ");
  return buffer;
  }
function program19(depth0,data) {
  
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options;
  data.buffer.push("\r\n        ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(20, program20, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "card", "item.data.cardid", options) : helperMissing.call(depth0, "link-to", "card", "item.data.cardid", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\r\n        ");
  return buffer;
  }
function program20(depth0,data) {
  
  
  data.buffer.push("Go to card");
  }

  data.buffer.push("\r\n");
  hashContexts = {'itemController': depth0};
  hashTypes = {'itemController': "STRING"};
  stack1 = helpers.each.call(depth0, "section", "in", "", {hash:{
    'itemController': ("section")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  return buffer;
  
});

Ember.TEMPLATES["settings/index"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  data.buffer.push("asdasd\r\nasd\r\na\r\nsda\r\nsd\r\nasd\r\na\r\nda\r\nsda\r\nsd\r\nad\r\na\r\nda\r\nd\r\nasd\r\na\r\nasd\r\nas\r\n\r\n");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\r\n");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "facebook", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  return buffer;
  
});

Ember.TEMPLATES["settings/profile"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("<div class=\"row\">\r\n  <div class=\"col-md-10\"><h4>SETTINGS</h4></div>\r\n  <div class=\"col-md-10\"><h4>SETTINGS</h4></div>\r\n</div>");
  
});

Ember.TEMPLATES["templates"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\r\n  <div class='col-md-12'>\r\n    <h4>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</h4>\r\n    <h4>Sections</h4>\r\n    <button class=\"btn btn-default\"");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "CreateSection", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Add Section</button>\r\n  </div>\r\n");
  return buffer;
  }

  data.buffer.push("\r\n");
  hashContexts = {'itemController': depth0};
  hashTypes = {'itemController': "STRING"};
  stack1 = helpers.each.call(depth0, {hash:{
    'itemController': ("card")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  return buffer;
  
});

Ember.TEMPLATES["DragAndDroppable"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  data.buffer.push("        ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "yield", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  return buffer;
  
});

Ember.TEMPLATES["DropDelete"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  data.buffer.push("      <div id=\"dropdelete\"style=\"position:absolute;top:60px;height:100%;width:100%\">\r\n        ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "yield", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\r\n      </div>");
  return buffer;
  
});

Ember.TEMPLATES["Qube"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("    <div class=\"col-md-5\" style=\"border:solid 1px;background:white\">\r\n    Drop here to delete\r\n    </div>");
  
});

Ember.TEMPLATES["TaggerView"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("<input id=\"tags\" type=\"text\" class=\"taggerInput\" placeholder=\"Enter tags\"/>");
  
});

Ember.TEMPLATES["canvas"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"containezr\" style=\"height:1000px;\">\r\n  ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\r\n</div>");
  return buffer;
  
});

Ember.TEMPLATES["cardview"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  data.buffer.push("      <div class=\"card\">\r\n        ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "yield", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\r\n    </div>");
  return buffer;
  
});

Ember.TEMPLATES["newSection"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\r\n      <form role=\"form\">\r\n        <div class=\"form-group\">\r\n          <label for=\"link\">Title</label>\r\n          ");
  hashContexts = {'type': depth0,'value': depth0,'class': depth0,'id': depth0,'placeholder': depth0};
  hashTypes = {'type': "STRING",'value': "ID",'class': "STRING",'id': "STRING",'placeholder': "STRING"};
  options = {hash:{
    'type': ("text"),
    'value': ("newTitle"),
    'class': ("form-control"),
    'id': ("title"),
    'placeholder': ("Enter title")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\r\n          </div>\r\n        <div class=\"form-group\">\r\n          <label for=\"type\">Type</label>\r\n          ");
  hashContexts = {'content': depth0,'selectionBinding': depth0,'class': depth0};
  hashTypes = {'content': "ID",'selectionBinding': "ID",'class': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'content': ("types"),
    'selectionBinding': ("selectedType"),
    'class': ("form-control")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\r\n          </div>\r\n          <button type=\"submit\" class=\"btn btn-success\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "Submit", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Save</button>\r\n      </form>\r\n    ");
  return buffer;
  }

  data.buffer.push("    ");
  hashContexts = {'action': depth0};
  hashTypes = {'action': "STRING"};
  options = {hash:{
    'action': ("close")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['modal-dialog'] || depth0['modal-dialog']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "modal-dialog", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  return buffer;
  
});

Ember.TEMPLATES["components/links-main"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes;
  data.buffer.push("\r\n    ");
  hashContexts = {'model': depth0};
  hashTypes = {'model': "ID"};
  stack1 = helpers.view.call(depth0, "App.LinkView", {hash:{
    'model': ("item")
  },inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\r\n      <li><a ");
  hashContexts = {'href': depth0};
  hashTypes = {'href': "ID"};
  options = {hash:{
    'href': ("item.data.href")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "item.data.title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</a></li>\r\n    ");
  return buffer;
  }

  data.buffer.push("<div style=\"margin-bottom:10px\">\r\n  ");
  hashContexts = {'type': depth0,'class': depth0,'placeholder': depth0,'value': depth0,'action': depth0};
  hashTypes = {'type': "STRING",'class': "STRING",'placeholder': "STRING",'value': "ID",'action': "STRING"};
  options = {hash:{
    'type': ("text"),
    'class': ("form-control"),
    'placeholder': ("enter link press enter to submit"),
    'value': ("newLink"),
    'action': ("Submit")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\r\n</div>\r\n  <ul>\r\n");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers.each.call(depth0, "item", "in", "data", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\r\n</ul>\r\n\r\n");
  return buffer;
  
});

Ember.TEMPLATES["components/property-main"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashContexts, hashTypes;
  data.buffer.push("\r\n    ");
  hashContexts = {'model': depth0};
  hashTypes = {'model': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.PropertyView", {hash:{
    'model': ("item")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\r\n");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes;
  data.buffer.push("\r\n  ");
  hashContexts = {'viewName': depth0,'context': depth0};
  hashTypes = {'viewName': "STRING",'context': "ID"};
  stack1 = helpers.view.call(depth0, "App.PopupView", {hash:{
    'viewName': ("popup"),
    'context': ("context")
  },inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n");
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\r\n    ");
  hashContexts = {'store': depth0,'section': depth0};
  hashTypes = {'store': "ID",'section': "ID"};
  options = {hash:{
    'store': ("store"),
    'section': ("section")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['property-form'] || depth0['property-form']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "property-form", options))));
  data.buffer.push("\r\n  ");
  return buffer;
  }

  data.buffer.push("<div class=\"row\">\r\n  <div class=\"col-md-6\"><b>Name</b></div>\r\n  <div class=\"col-md-6\"><b>Value</b></div>\r\n</div>\r\n");
  hashContexts = {'itemController': depth0};
  hashTypes = {'itemController': "STRING"};
  stack1 = helpers.each.call(depth0, "item", "in", "data", {hash:{
    'itemController': ("property")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n<button class=\"btn btn-default\"");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "openModalSource", "propertyForm", "model", {hash:{},contexts:[depth0,depth0,depth0],types:["STRING","STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("> New Property </button>\r\n");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "openPopup", {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n");
  return buffer;
  
});

Ember.TEMPLATES["property"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashContexts, hashTypes;
  data.buffer.push("\r\n    ");
  hashContexts = {'class': depth0,'toggleDone': depth0,'value': depth0};
  hashTypes = {'class': "STRING",'toggleDone': "ID",'value': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.EditBox", {hash:{
    'class': ("form-control"),
    'toggleDone': ("isNediting"),
    'value': ("model.data.name")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\r\n    ");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\r\n    <p ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleN", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.data.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</p>\r\n    ");
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = '', hashContexts, hashTypes;
  data.buffer.push("\r\n    ");
  hashContexts = {'class': depth0,'toggleDone': depth0,'value': depth0};
  hashTypes = {'class': "STRING",'toggleDone': "ID",'value': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.EditBox", {hash:{
    'class': ("form-control"),
    'toggleDone': ("isVediting"),
    'value': ("model.data.value")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\r\n    ");
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\r\n    <p ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleV", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.data.value", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</p>\r\n    ");
  return buffer;
  }

  data.buffer.push("<div class=\"row\">\r\n  <div class=\"col-md-6\">\r\n    ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "isNediting", {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n  </div>\r\n  <div class=\"col-md-6\">\r\n    ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "isVediting", {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n  </div>\r\n</div>");
  return buffer;
  
});

Ember.TEMPLATES["propertyForm"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var stack1, stack2, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\r\n  <div style=\"margin-bottom:10px\">\r\n    ");
  hashContexts = {'type': depth0,'class': depth0,'placeholder': depth0,'value': depth0};
  hashTypes = {'type': "STRING",'class': "STRING",'placeholder': "STRING",'value': "ID"};
  options = {hash:{
    'type': ("text"),
    'class': ("form-control"),
    'placeholder': ("Enter property name"),
    'value': ("name")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\r\n    ");
  hashContexts = {'type': depth0,'class': depth0,'placeholder': depth0,'value': depth0};
  hashTypes = {'type': "STRING",'class': "STRING",'placeholder': "STRING",'value': "ID"};
  options = {hash:{
    'type': ("text"),
    'class': ("form-control"),
    'placeholder': ("Enter property value"),
    'value': ("value")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\r\n    ");
  hashContexts = {'content': depth0,'selectionBinding': depth0,'class': depth0};
  hashTypes = {'content': "ID",'selectionBinding': "ID",'class': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'content': ("types"),
    'selectionBinding': ("selectedType"),
    'class': ("form-control")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\r\n    <button class=\"btn btn-default\"");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "CreateProperty", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("> submit </button>\r\n  </div>\r\n");
  return buffer;
  }

  hashContexts = {'action': depth0};
  hashTypes = {'action': "STRING"};
  options = {hash:{
    'action': ("close")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['modal-dialog'] || depth0['modal-dialog']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "modal-dialog", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  else { data.buffer.push(''); }
  
});

Ember.TEMPLATES["components/question-form"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("  ");
  hashContexts = {'type': depth0,'class': depth0,'placeholder': depth0,'value': depth0,'action': depth0};
  hashTypes = {'type': "STRING",'class': "STRING",'placeholder': "STRING",'value': "ID",'action': "STRING"};
  options = {hash:{
    'type': ("text"),
    'class': ("form-control"),
    'placeholder': ("enter question press enter to submit"),
    'value': ("question"),
    'action': ("CreateQuestion")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\r\n\r\n");
  return buffer;
  
});

Ember.TEMPLATES["components/question-main"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options;
  data.buffer.push("\r\n   <div class=\"panel panel-default\">\r\n    <div class=\"panel-heading\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "ToggleAnswer", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\r\n      <h4 class=\"panel-title\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "ToggleAnswer", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\r\n          ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "data.question", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\r\n      </h4>\r\n    </div>\r\n    <div  ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("answerClass")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(">\r\n      <div class=\"panel-body\">\r\n        ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "data.answer", {hash:{},inverse:self.program(7, program7, data),fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\r\n\r\n      </div>\r\n    </div>\r\n  </div>\r\n  ");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\r\n          ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "isEditingAnswer", {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n        ");
  return buffer;
  }
function program3(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\r\n            ");
  hashContexts = {'class': depth0,'placeholder': depth0,'value': depth0};
  hashTypes = {'class': "STRING",'placeholder': "STRING",'value': "ID"};
  options = {hash:{
    'class': ("form-control"),
    'placeholder': ("enter answer"),
    'value': ("data.answer")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.textarea || depth0.textarea),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "textarea", options))));
  data.buffer.push("\r\n            <button class=\"btn btn-deafult\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "UpdateQuestion", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Save</button>\r\n          ");
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\r\n        <p ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "ToggleEditAnswer", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "data.answer", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</p>\r\n          ");
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\r\n          ");
  hashContexts = {'class': depth0,'placeholder': depth0,'value': depth0};
  hashTypes = {'class': "STRING",'placeholder': "STRING",'value': "ID"};
  options = {hash:{
    'class': ("form-control"),
    'placeholder': ("enter answer"),
    'value': ("answer")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.textarea || depth0.textarea),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "textarea", options))));
  data.buffer.push("\r\n          <button class=\"btn btn-deafult\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "NewAnswer", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Answer now</button>\r\n        ");
  return buffer;
  }

  data.buffer.push("<div style=\"margin-bottom:10px\">\r\n  ");
  hashContexts = {'type': depth0,'class': depth0,'placeholder': depth0,'value': depth0,'action': depth0};
  hashTypes = {'type': "STRING",'class': "STRING",'placeholder': "STRING",'value': "ID",'action': "STRING"};
  options = {hash:{
    'type': ("text"),
    'class': ("form-control"),
    'placeholder': ("enter question press enter to submit"),
    'value': ("newQuestion"),
    'action': ("CreateQuestion")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\r\n</div>\r\n<div class=\"panel-group\">\r\n  ");
  hashContexts = {'itemController': depth0};
  hashTypes = {'itemController': "STRING"};
  stack2 = helpers.each.call(depth0, "item", "in", "data", {hash:{
    'itemController': ("question")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\r\n</div>\r\n\r\n");
  return buffer;
  
});

Ember.TEMPLATES["components/tasks-form"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\r\n    <button type=\"submit\" class=\"btn btn-success\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "Submit", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Save</button>\r\n  ");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\r\n    <button type=\"submit\" class=\"btn btn-default\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "Submit", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Submit</button>\r\n  ");
  return buffer;
  }

  data.buffer.push("<form role=\"form\">\r\n  <div class=\"form-group\">\r\n    <label for=\"link\">Task </label>\r\n    ");
  hashContexts = {'type': depth0,'value': depth0,'class': depth0,'id': depth0,'placeholder': depth0};
  hashTypes = {'type': "STRING",'value': "ID",'class': "STRING",'id': "STRING",'placeholder': "STRING"};
  options = {hash:{
    'type': ("text"),
    'value': ("link"),
    'class': ("form-control"),
    'id': ("link"),
    'placeholder': ("Enter link")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\r\n  </div>\r\n  <div class=\"form-group\">\r\n    <label for=\"tags\">Tags</label>\r\n    ");
  hashContexts = {'viewName': depth0};
  hashTypes = {'viewName': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.TaggerView", {hash:{
    'viewName': ("tagger")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\r\n  </div>\r\n  ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "id", {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\r\n</form>");
  return buffer;
  
});

Ember.TEMPLATES["components/tasks-main"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashContexts, hashTypes;
  data.buffer.push("\r\n  <li class=\"list-group-item\" ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "Hover", {hash:{
    'on': ("focusIn")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "data.title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\r\n    <div class=\"pull-right\">\r\n      <button type=\"button\" class=\"btn btn-default btn-sm\">\r\n        <span class=\"glyphicon glyphicon-play\"></span>\r\n      </button>\r\n      <button type=\"button\" class=\"btn btn-default btn-sm\">\r\n        <span class=\"glyphicon glyphicon-stop\"></span>\r\n      </button>\r\n    </div>\r\n  </li>\r\n");
  return buffer;
  }

  data.buffer.push("<div style=\"margin-bottom:10px\">\r\n  ");
  hashContexts = {'type': depth0,'class': depth0,'placeholder': depth0,'value': depth0,'action': depth0};
  hashTypes = {'type': "STRING",'class': "STRING",'placeholder': "STRING",'value': "ID",'action': "STRING"};
  options = {hash:{
    'type': ("text"),
    'class': ("form-control"),
    'placeholder': ("enter link press enter to submit"),
    'value': ("newTask"),
    'action': ("CreateTask")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\r\n</div>\r\n<ul class=\"list-group\">\r\n");
  hashContexts = {'itemController': depth0};
  hashTypes = {'itemController': "STRING"};
  stack2 = helpers.each.call(depth0, "data", {hash:{
    'itemController': ("task")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\r\n</ul>\r\n\r\n");
  return buffer;
  
});

Ember.TEMPLATES["components/text-area"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\r\n  ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "item", "in", "data", {hash:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\r\n    ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "isEditing", {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n  ");
  return buffer;
  }
function program3(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\r\n      ");
  hashContexts = {'row': depth0,'col': depth0,'value': depth0,'style': depth0};
  hashTypes = {'row': "STRING",'col': "STRING",'value': "ID",'style': "STRING"};
  options = {hash:{
    'row': ("30"),
    'col': ("30"),
    'value': ("item.data.value"),
    'style': ("width: 100%;height: 130px;")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.textarea || depth0.textarea),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "textarea", options))));
  data.buffer.push("\r\n      <button class=\"btn btn-default\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "Update", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">submit</button>\r\n    ");
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\r\n      <p ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "ToggleEdit", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" >");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "item.data.value", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</p>\r\n    ");
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\r\n  ");
  hashContexts = {'class': depth0,'row': depth0,'col': depth0,'value': depth0,'style': depth0};
  hashTypes = {'class': "STRING",'row': "STRING",'col': "STRING",'value': "ID",'style': "STRING"};
  options = {hash:{
    'class': ("form-control"),
    'row': ("30"),
    'col': ("30"),
    'value': ("newText"),
    'style': ("width: 100%;height: 130px;")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.textarea || depth0.textarea),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "textarea", options))));
  data.buffer.push("\r\n  <button class=\"btn btn-default\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "NewMultiLineText", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">submit</button>\r\n");
  return buffer;
  }

  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "hasText", {hash:{},inverse:self.program(7, program7, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n");
  return buffer;
  
});