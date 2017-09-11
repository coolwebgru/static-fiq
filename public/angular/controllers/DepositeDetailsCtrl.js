(function () {
    'use strict';

    var m = angular.module("DepositeDetailsCtrl", []);

    var depositeDetailsControllerFunction = function ($route, $location, $rootScope, $routeParams, $scope, depositeDetails, GetCurrentUserService, AccountService, TextService) {

        $scope.init = function () {
            $scope.content = depositeDetails;

            $('html, body').animate({
                scrollTop: 0
            }, 500);
        };

        var jsonRequest = {
            "amount": depositeDetails.amount
        }


        var achRelationshipId = depositeDetails.achRelationshipId;

        $scope.submitDeposite = function() {

            AccountService.asAuthenticated(function() {
                AccountService.createAchDeposit(achRelationshipId, jsonRequest)
                .then(function(response) {
                    console.log("depositAch", response);
                    if (response.status.statusCode == "OK") {
                        TextService.popup("successed_deposite");
                    } else {
                        TextService.popup("error_deposite", {data: [response.status.statusDescription]});
                    }
                    $location.path("/account-overview/");
                });
            });

        };

        $scope.cancelDeposite = function() {
            AccountService.asAuthenticated(function() {
                TextService.popup('cancelled_deposite');
            })
        };

        $scope.init();
    };

    m.controller('DepositeDetailsController', [
        '$route',
        '$location',
        '$rootScope',
        '$routeParams',
        '$scope',
        'depositeDetails',
        'GetCurrentUserService',
        'AccountService',
        'TextService',
        depositeDetailsControllerFunction
    ]);
})();
