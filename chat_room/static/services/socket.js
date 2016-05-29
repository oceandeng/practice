// 将socket.io封装成名为socket的AngularJS服务
// 调用$scope.$apply(callback) 就是执行callback, 数据状态有变化就更行index.html
chatRoomApp.factory('socket', function($rootScope){
	var socket = io.connect('/');
	return {
		on: function(eventName, callback){
			socket.on(eventName, function(){
				var args = arguments;
				$rootScope.$apply(function(){
					callback.apply(socket, args);
				});
			});
		},
		emit: function(eventName, data, callback){
			socket.emit(eventName, data, function(){
				var args = arguments;
				$rootScope.$apply(function(){
					if(callback){
						callback.apply(socket, args);
					}
				})
			})
		}
	}
});