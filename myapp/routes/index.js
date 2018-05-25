var express = require('express');
var index = express.Router();

index.get('/', function(req, res, next) {
  res.send('Hello');
});

module.exports = index;
