var express = require('express');
var app = express();
var path = require('path');

var port = process.env.PORT || 3000;

// NODE_ENV = production;

if('development' == app.get('env')){
	app.set('staticPath', '/static');	//开发环境
} else {
	app.set('staticPath', '/build');	//生产环境
}

// 将静态文件放在static目录下
// app.use(express.static(path.join(__dirname, '/static')));
app.use(express.static(__dirname + app.get('staticPath')));

app.use(function(req, res){
	res.sendFile(path.join(__dirname, '/index.html'));
});

var server = app.listen(port, function(){
	console.log('technode is on port ' + port + '!');
});

var io = require('socket.io').listen(server);

var messages = [];
io.sockets.on('connection', function(socket){
	socket.on('getAllMessages', function(){
		socket.emit('allMessages', messages)
	});
	socket.on('createMessage', function(message){
		messages.push(message);
		io.sockets.emit('messageAdded', message);
	})
	// socket.emit('connected');
});