(function () {
    'use strict';

    var m = angular.module("LoginModalCtrl", []);

    var loginModalControllerFunction = function ($location, $route, $rootScope, $routeParams, $scope, LoginService, TextService, next, ModalService) {

        $scope.init = function () {
            $('html, body').animate({
                scrollTop: 0
            }, 500);
        };

        $scope.login = function() {
            var requestJSON = {
                emailAddress: $scope.userEmail,
                password: $scope.userPassword
            };

            LoginService.createSession(requestJSON)
                .then(function (response) {
                    console.log(response);
                    $("#loginModal").modal("hide");
                    if (response.status.statusCode == "OK") {
                        TextService.popup('login_success');
                        $rootScope.$broadcast("login_success");
                        next();
                    }
                    else {
                        TextService.popup('login_failure', { data: [ response.status.statusDescription ] });
                        $location.path("/");
                    }
                });
        };

        $scope.close = function(param) {
            $location.path("/");
        };

        $scope.init();
    };

    m.controller('LoginModalController', [
        '$location',
        '$route',
        '$rootScope',
        '$routeParams',
        '$scope',
        'LoginService',
        'TextService',
        'next',
        'ModalService',
        loginModalControllerFunction
    ]);
})();
