
var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var bodyParser = require("body-parser");
var path = require('path');
var sqlitedb = require('./models/db/sqlitedb');

var config = require('./config.js');
var routes = require('./routes/routes.js');

server.listen(config.serverConfig.port, () => {
    console.log('server listening at port ' + config.serverConfig.port);

    createDBTables();
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
  });

process.on('uncaughtException', (err) => {
    console.log("uncaughtException Error: " + err);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("build"));

app.use("/", routes);

function createDBTables() {
    sqlitedb.openDBConnection();
    sqlitedb.createTables();
    sqlitedb.closeDBConnection();
}