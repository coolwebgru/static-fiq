(function () {
    'use strict';

    var m = angular.module('AppCtrl', []);

    var appControllerFunction = function ($location, $rootScope, $route, $scope, CheckAuthenticateService, LoginService, TextService, GetCurrentUserService) {

        // $scope.login_flag = false;
        $scope.init = function () {
            $scope.resumeFlag = sessionStorage.getItem("resumeFlag");
            CheckAuthenticateService.checkAuthenticate()
            .then(function (response) {
                $rootScope.login_flag = response;
                if ($rootScope.login_flag == true) {
                    GetCurrentUserService.getCurrentUser()
                    .then(function(currentUser) {
                        console.log("currentUser", currentUser);
                        $scope.currentUserName = currentUser.response.accountHolders[0].firstName + " " + currentUser.response.accountHolders[0].lastName;
                    });
                }
            });
        };

        $scope.$on("resumeFlag_selected", function (event, args) {
            $scope.resumeFlag = sessionStorage.getItem("resumeFlag");
        });
        $scope.$on("login_success", function (event, args) {
            $rootScope.login_flag = true;
            GetCurrentUserService.getCurrentUser()
            .then(function(currentUser) {
                console.log("currentUser", currentUser);
                $scope.currentUserName = currentUser.response.accountHolders[0].firstName + " " + currentUser.response.accountHolders[0].lastName;
            });
            var beforeURL = "/account-overview";
            if (sessionStorage.getItem("beforeURL")) {
                beforeURL = sessionStorage.getItem("beforeURL");
            }
            $location.path(beforeURL);
            $route.reload();
            // do what you want to do
        });

        $scope.onClickLoginBtn = function() {
            sessionStorage.setItem("beforeURL", "/account-overview");
        }

        $scope.logout = function () {
            LoginService.logout()
                .then(function (response) {
                    console.log(response);
                    if (response.status.statusCode == "OK") {
                        $route.reload();
                        $rootScope.login_flag = false;
                        $location.path("/");
                    }
                    else {
                        TextService.popup('raw_data', {data: [response.status.statusDescription]});
                    }
                });
        };

        $scope.init();
    };

    m.controller('AppController', [
        "$location",
        "$rootScope",
        "$route",
        "$scope",
        "CheckAuthenticateService",
        "LoginService",
        'TextService',
        "GetCurrentUserService",
        appControllerFunction
    ]);
})();
