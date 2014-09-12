var express = require('express');
var app = express();
var http = require('http');

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello , this is app express framework!\n')
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})

app.set('port_01', ( parseInt(process.env.PORT)  + 1 || 5000 + 1))

http.createServer(function(request, response) {
	response.writeHead(200);
	response.write("Hello, this is a http server\n");
	response.end();
}).listen(app.get('port_01'));
console.log("Http server listening on port " + app.get('port_01') + "....");

/* WebSocket */
var server = http.createServer(app);
app.set('port_02', ( parseInt(process.env.PORT)  + 2 || 5000 + 2))
server.listen(app.get('port_02'));

var wss = new WebSocketServer({server: server});
console.log('websocket server created');
wss.on('connection', function(ws) {
  var id = setInterval(function() {
    ws.send(JSON.stringify(new Date()), function() {  });
  }, 1000);

  console.log('websocket connection open');

  ws.on('close', function() {
    console.log('websocket connection close');
    clearInterval(id);
  });
});
