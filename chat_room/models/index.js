var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chatroom');
exports.User = mongoose.model('User', require('./user'));
exports.Message = mongoose.model('Message', require('./message'));