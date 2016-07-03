// RoomCtrl
chatRoomApp.controller('RoomCtrl', function($scope, socket){
	// $scope.messages = [];
	// socket.emit('getAllMessage');

	// socket.on('allMessages', function(messages){
	// 	console.log(messages);
	// 	$scope.messages = messages;
	// });
	
	$scope.chatroom = {};
	$scope.chatroom.messages = [];

	socket.on('roomData', function(room){
console.log(room)
		$scope.room = room
	});

	socket.on('messageAdded', function(message){
		$scope.chatroom.messages.push(message);
		socket.emit('getRoom');
	})

	socket.emit('getRoom');

	socket.on('online', function(user){
		$scope.room.users.push(user);
	})
	socket.on('offline', function(user){
		_userId = user._id;
		$scope.room.users = $scope.room.users.filter(function(user){
			return user._id != _userId;
		})
	})
});