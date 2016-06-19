var chatRoomApp = angular.module('ChatRoomApp', ['ui.router']);

// 登录验证
chatRoomApp.run(function($window, $rootScope, $http, $location){
	$http({
		url: '/api/validate',
		method: 'GET'
	}).success(function(user){
		$rootScope.me = user;
		$location.path('/');
	}).error(function(data){
		$location.path('/login');
	});
	$rootScope.logout = function(){
		$http({
			url: '/api/logout',
			method: 'GET'
		}).success(function(){
			$rootScope.me = null;
			$location.path('/login');
		})
	}
	$rootScope.$on('login', function(evt, me){
		$rootScope.me = me;
	})
})

chatRoomApp.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/login');
	$stateProvider.state('/', {
		url: '/',
		views: {
			'': {
				templateUrl: 'pages/room.html',
				controller: 'RoomCtrl'
			}
		}
	}).state('login', {
		url: '/login',
		views: {
			'': {
				templateUrl: 'pages/login.html',
				controller: 'LoginCtrl'
			}
		}
	})
});