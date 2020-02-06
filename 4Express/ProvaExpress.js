var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/pluto', function (req, res) {
    res.send('Hello Pluto!');
  });

app.listen(3456, function () {
  console.log('Example app listening on port 3000!');
});