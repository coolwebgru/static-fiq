(function () {
    'use strict';

    var m = angular.module("WithdrawDetailsCtrl", []);

    var withdrawControllerFunction = function ($route, $location, $rootScope, $routeParams, $scope, withdrawDetails, GetCurrentUserService, AccountService, TextService) {

        $scope.init = function () {
            $scope.content = withdrawDetails;

            $('html, body').animate({
                scrollTop: 0
            }, 500);
        };

        var jsonRequest = {
            "isFullBalance": withdrawDetails.isFullBalance,
            "amount": withdrawDetails.amount
        };

        $scope.boolText = {
            true: "True",
            false: "False"
        };


        var achRelationshipId = withdrawDetails.achRelationshipId;

        $scope.submitWithdraw = function() {

            AccountService.asAuthenticated(function() {
                AccountService.createAchWithdrawl(achRelationshipId, jsonRequest)
                .then(function(response) {
                    console.log("withdrawAch", response);
                    if (response.status.statusCode == "OK") {
                        TextService.popup("successed_withdraw");
                    } else {
                        TextService.popup("error_withdraw", {data: [response.status.statusDescription]});
                    }
                    $location.path("/account-overview/withdraw-money");
                });
            });
                    
        };

        $scope.cancelWithdraw = function() {
            AccountService.asAuthenticated(function() {
                TextService.popup('cancelled_withdraw');
            });
        }

        $scope.init();
    };

    m.controller('WithdrawDetailsController', [
        '$route',
        '$location',
        '$rootScope',
        '$routeParams',
        '$scope',
        'withdrawDetails',
        'GetCurrentUserService',
        'AccountService',
        'TextService',
        withdrawControllerFunction
    ]);
})();
