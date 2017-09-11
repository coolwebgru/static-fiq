(function () {
    'use strict';

    var m = angular.module("AccountDetailsCtrl", []);

    var accountDetailsControllerFunction = function ($route, $location, $rootScope, $routeParams, $scope, accountDetails, GetCurrentUserService, AccountService, TextService) {

        $scope.init = function () {
            $scope.content = accountDetails;

            $('html, body').animate({
                scrollTop: 0
            }, 500);
        };

        $scope.submitAccount = function() {

            AccountService.asAuthenticated(function() {
                GetCurrentUserService.getCurrentUser()
                .then(function(currentUser) {
                    var user_id = currentUser.response.id;
                    AccountService.createAchRelationship(user_id, accountDetails)
                    .then(function(response) {
                        console.log("addAccount", response);
                        if (response.status.statusCode == "OK") {
                            TextService.popup('successed_account');
                        } else {
                            TextService.popup('error_account', {data: [response.status.statusDescription]});
                        }

                        $location.path("/account-overview/add-money");
                        $route.reload();
                    });
                });
            });

        };

        $scope.cancelAccount = function() {
            AccountService.asAuthenticated(function() {
                TextService.popup('cancelled_account');
            });
            
        };

        $scope.init();
    };

    m.controller('AccountDetailsController', [
        '$route',
        '$location',
        '$rootScope',
        '$routeParams',
        '$scope',
        'accountDetails',
        'GetCurrentUserService',
        'AccountService',
        'TextService',
        accountDetailsControllerFunction
    ]);
})();
