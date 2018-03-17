const express = require('express');
const member = require('./member');
const app = express();
const router = express.Router();

app.use('/anggota', member);

module.exports = app;