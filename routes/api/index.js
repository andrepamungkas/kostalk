var express = require('express');
var v1 = require('./v1');
var app = express();

app.use('/v1', v1);

module.exports = app;