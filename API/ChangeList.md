var ServiceModule = require('./ServiceModule.js') -> var controller = require('./controller.js')
Application.prototype = new ServiceModule(settings); - > Application.prototype = new controller(settings);
var queryStream = settings.executeQuery(query,sessionToken); -> this.executeQuery(query,sessionToken).on('data',function(){})