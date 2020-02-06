var dispatcher = require('httpdispatcher');

dispatcher.onGet("/page1", function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Page One');
});

dispatcher.onPost("/page2", function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Page Two');
});

var server = http.createServer(function (req, res) {
  dispatcher.dispatch(req, res);
});

server.listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');