(function () {
    'use strict';

    var m = angular.module("CancelAchDetailsCtrl", []);

    var cancelAchDetailsControllerFunction = function ($route, $location, $rootScope, $routeParams, $scope, cancelAchDetails, GetCurrentUserService, AccountService, TextService) {

        $scope.init = function () {
            $scope.content = cancelAchDetails;

            console.log($scope.content);

            $('html, body').animate({
                scrollTop: 0
            }, 500);
        };

        var achRelationshipId = cancelAchDetails.achRelationshipId;

        var jsonRequest = {
            confirmationId: achRelationshipId
        };

        $scope.submitCancel = function() {

            AccountService.asAuthenticated(function() {
                AccountService.deleteAch(achRelationshipId, jsonRequest)
                .then(function(response) {
                    console.log("cancelAch", response);
                    if (response.status.statusCode == "OK") {
                        TextService.popup("successed_cancelAch");
                    } else {
                        TextService.popup("cancelled_cancelAch", {data: [response.status.statusDescription]});
                    }
                    $location.path("/account-overview/add-money");
                });
            });
        };

        $scope.init();
    };

    m.controller('CancelAchDetailsController', [
        '$route',
        '$location',
        '$rootScope',
        '$routeParams',
        '$scope',
        'cancelAchDetails',
        'GetCurrentUserService',
        'AccountService',
        'TextService',
        cancelAchDetailsControllerFunction
    ]);
})();
