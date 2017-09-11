angular.module("RootCtrl", []).controller('RootController', ["$scope", '$routeParams', 
	function($scope, $routeParams, SignUpService) {
	
	$scope.init = function() {
	};

	$scope.logout = function() {
		console.log('logout');
	}


	$scope.init();

}]);
