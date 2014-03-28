var express = require('express'),
	mongoose = require('mongoose'),
	fs = require('fs'),
	config = require('./config/config');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach(function (file) {
  if (file.indexOf('.js') >= 0) {
    require(modelsPath + '/' + file);
  }
});

var server = express();

require('./config/express')(server, config);
require('./config/routes')(server);


server.listen(config.port);

console.log("Server listening on port %d", config.port);