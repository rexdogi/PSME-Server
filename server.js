/// <reference path="./typings/tsd.d.ts"/>​
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer = require('multer');
var fs = require('fs');
var cors = require('cors');
var routes = require('./server/resources/index');
var databaseUrl = 'localhost';
var database = require('./config/database');
var jwt = require('express-jwt');

var jwtCheck = jwt({
	secret: new Buffer(''),
	audience: ''
});

// configuration ===============================================================
if (mongoose.connect(database.url)) {
	console.log("Successfully connected to the database: " + databaseUrl);
}
else {
	console.log("Not able to connect to the database: " + databaseUrl);
}
var jsonParser = bodyParser.json();

app.use(cors());
// app.use('/uploads', app.static('uploads'));
// app.use(app.static(__dirname + '/node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(function(req, res, next) {
	res.set('X-Powered-By', '')
	next();
})
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTIONS');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
	next();
});

app.get('/', routes.index);


require('./server/routes.js')(app);
app.use('/api/protected/', jwtCheck);
require('./server/controllers/socket-controllers/socket-controller.js')(io);

server.listen(3003, function () {
	console.log("Demo Express server listening on port %d");
});
exports.App = app;