var express = require('express');
var app = express();
var http = require('http');

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})

http.createServer(function(request, response) {
	response.writeHead(200);
	response.write("hello, this is a dog");
	response.end();
}).listen(5001);

console.log("Listening on port 5001....")
