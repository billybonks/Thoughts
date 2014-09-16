var restify = require('restify');
var socketio = require('socket.io');
var fs = require('fs');
var server = restify.createServer();
var io = socketio.listen(server);
var nconf = require('nconf');
var routeFiles = fs.readdirSync('routes');

nconf.file('./config.json')

var routes = {}
server.use(restify.bodyParser());
server.use(restify.queryParser());
//restify.CORS.ALLOW_HEADERS.push('sid');
server.opts(/\.*/, function(req, res, next) {
  res.send(200);
  next();
});

//Init routes and controllers
for (var i = 0; i < routeFiles.length; i++) {
  if (routeFiles[i] !== 'route.js') {
    var routeName = routeFiles[i].split('.')[0];

    var controller = require('./controllers/' + routeName + '_controller.js')();
    var route = require('./routes/' + routeFiles[i])(controller, io, server);
    routes[routeName] = route;
    //console.log(routes)
  }
}

//server.head('/hello/:name', respond);

io.on('connection', function(socket) {
  for (var routeName in routes) {
    routes[routeName].onConnection(socket);
  }
});
/*
socket.on('product_create', function(from, object) {
  console.log('creating prod')
  io.emit('product_create', "hello");
  })
*/


server.listen(5080, function() {
  console.log('socket.io server listening at %s', server.url);
});
