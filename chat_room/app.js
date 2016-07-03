var express = require('express');
var app = express();
var path = require('path');

// 验证接口
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var Controllers = require('./controllers');
var signedCookieParser = cookieParser('chatroom');
var MongoStore = require('connect-mongo')(session);
var sessionStore = new MongoStore({
	url: 'mongodb://localhost/chatroom'
});

// app.use(express.bodyParser());
// app.use(express.cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser());
app.use(session({
	secret: 'chatroom',
	resave: true,
	saveUninitialized: false,
	cookie: {
		maxAge: 60 * 1000 * 60 * 24
	},
	store: sessionStore
}))

var port = process.env.PORT || 3000;

// NODE_ENV = production;

if('development' == app.get('env')){
	app.set('staticPath', '/static');	//开发环境
} else {
	app.set('staticPath', '/build');	//生产环境
}
// 将静态文件放在static目录下
app.use(express.static(path.join(__dirname, app.get('staticPath'))));

app.get('/api/validate', function(req, res){
	var _userId = req.session._userId;
	if(_userId){
		Controllers.User.findUserById(_userId, function(err, user){
			if(err){
				res.json(401, {
					msg: err
				})
			} else {
				res.json(user);
			}
		})
	} else {
		res.json(401, null);
	}
});

app.post('/api/login', function(req, res){
	var email = req.body.email;
	if(email){
		Controllers.User.findByEmailOrCreate(email, function(err, user){
			if(err){
				res.json(500, {
					msg: err
				})
			}else{
				req.session._userId = user._id;
				Controllers.User.online(user._id, function(err, user){
					if(err){
						res.json(500, {
							msg: err
						})
					}else{
						res.json(user)
					}
				})
			}
		})
	}else{
		res.json(403);
	}
})

app.get('/api/logout', function(req, res){
	var _userId = req.session._userId;
	Controllers.User.offline(_userId, function(err, user){
		if(err){
			res.json(500, {
				msg: err
			})
		}else{
			res.json(200);
			delete req.session._userId;
		}
	});
});

app.use(function(req, res){
	res.sendFile(path.join(__dirname, './static/index.html'));
});

var server = app.listen(port, function(){
	console.log('chatroom is on port ' + port + '!');
});

// scoket.io认证接口
var io = require('socket.io').listen(server);

io.set('authorization', function(handshakeData, accept){
	signedCookieParser(handshakeData, {}, function(err){
		if(err){
			accept(err, false);
		} else {
			sessionStore.get(handshakeData.signedCookies['connect.sid'], function(err, session){
				if(err){
					accept(err.message, false);
				} else {
					handshakeData.session = session;
					if(session._userId){
						accept(null, true);
					} else {
						accept('No Login');
					}
				}
			})
		}
	})
})

var messages = [];
io.sockets.on('connection', function(socket){
	if(socket.request.session == undefined) return;
	var _userId = socket.request.session._userId;
	Controllers.User.online(_userId, function(err, user){
		if(err){
			socket.emit('err', {
				msg: err
			})
		}else{
			socket.broadcast.emit('online', user);
		}
	})
	socket.on('disconnect', function(){
		Controllers.User.offline(_userId, function(err, user){
			if(err){
				socket.emit('err', {
					msg: err
				})
			}else{
				socket.broadcast.emit('offline', user);
			}
		})
	})
	socket.on('getRoom', function(){
		Controllers.User.getOnlineUsers(function(err, users){
			if(err){
				socket.emit('err', {
					msg: err
				})
			}else{
				socket.emit('roomData', {
					users: users,
					messages: messages
				})
			}
		})
	});
	socket.on('messages.create', function(message){
		messages.push(message);
		io.sockets.emit('messageAdded', message);
	})
	// socket.emit('connected');
});