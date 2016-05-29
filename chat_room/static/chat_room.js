var chatRoomApp = angular.module('ChatRoomApp', ['ui.router']);

chatRoomApp.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/index');
	$stateProvider.state('/', {
		url: '/',
		views: {
			'': {
				templateUrl: '/pages/room.html',
				controller: 'RoomCtrl'
			}
		}
	}).state('login', {
		url: '/login',
		views: {
			'': {
				templateUrl: '/pages/login.html',
				controller: 'LoginCtrl'
			}
		}
	})
});
