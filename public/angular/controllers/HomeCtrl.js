angular.module('HomeCtrl', []).controller('HomeController', ["$scope", "$rootScope", function($scope, $rootScope) {
    
    $rootScope.getStartedFlag = 0;
    $scope.clickedGetStarted = function() {
        $rootScope.getStartedFlag = 1;
    };
    $scope.init = function() {
        $('html, body').animate({
            scrollTop: 0
        }, 500);
    };

    $scope.init();
}]);

