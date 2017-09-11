angular.module("SignUpCtrl", []).controller('SignUpController', ["$scope", '$routeParams', 'SignUpService', "$location", "TextService",
	function($scope, $routeParams, SignUpService, $location, TextService) {
	
	$scope.init = function() {
		console.log($routeParams.token);
		// CheckAuthenticateService.checkAuthenticate()
		// .then(function(response) {
		// 	console.log(response);
		// });
		SignUpService.retrieveEmail($routeParams.token)
		.then(function(response) {
			console.log(response);
			if (response.response != null) {
				$scope.email = response.response.emailAddress;	
			}
		});
	};

	$scope.signup = function() {
		if ($scope.userPassword == $scope.userConfirmPassword) {
			// if ($scope.email) {
				var jsonPassword = {
					password: $scope.userPassword
				}
				SignUpService.createLogin($routeParams.token, jsonPassword)
				.then(function(response) {
					console.log(response);
					if (response.status.statusCode == "OK") {
						TextService.popup('signup_success');
						$location.path("/login");
					}
					else {
						TextService.popup('signup_failure', { data: [ response.status.statusDescription ]});
					}
				});
			// }
		}
		else {
			TextService.popup('confirm_password');
		}
	}

	$scope.init();

}]);
