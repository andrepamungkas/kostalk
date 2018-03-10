const express = require('express');
const app = express();
const pemilik = require('./pemilik');

app.use('/pemilik', pemilik);

module.exports = app;