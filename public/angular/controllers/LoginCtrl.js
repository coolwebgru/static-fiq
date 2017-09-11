(function () {
    'use strict';

    var m = angular.module("LoginCtrl", []);

    var loginControllerFunction = function ($location, $rootScope, $routeParams, $scope, LoginService, TextService) {

        $scope.init = function () {
            $('html, body').animate({
                scrollTop: 0
            }, 500);
        };

        $scope.login = function () {
            var requestJSON = {
                emailAddress: $scope.userEmail,
                password: $scope.userPassword
            };

            LoginService.createSession(requestJSON)
                .then(function (response) {
                    console.log(response);
                    if (response.status.statusCode == "OK") {
                        sessionStorage.setItem("tableId", 0);
                        TextService.popup('login_success');
                        $rootScope.$broadcast("login_success");
                    }
                    else {
                        TextService.popup('login_failure', { data: [ response.status.statusDescription ] });
                    }
                });
        };

        $scope.changePassword = function () {
            if ($scope.userNewPassword == $scope.userNewConfirmPassword) {
                var requestJSON = {
                    password: $scope.userOldPassword,
                    newPassword: $scope.userNewPassword
                };
                LoginService.changePassword(requestJSON)
                    .then(function (response) {
                        console.log(response);
                        if (response.status.statusCode == "OK") {
                            TextService.popup('change_password_success');
                            $location.path("/");
                        }
                        else {
                            TextService.popup('change_password_failure', { data: [ response.status.statusDescription ] });
                        }
                    });
            } else {
                TextService.popup('change_password_mismatch');
            }
        };

        $scope.init();
    };

    m.controller('LoginController', [
        '$location',
        '$rootScope',
        '$routeParams',
        '$scope',
        'LoginService',
        'TextService',
        loginControllerFunction
    ]);
})();
