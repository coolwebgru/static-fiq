(function () {
    'use strict';

    var m = angular.module("TransferDetailsModalCtrl", []);

    var transferDetailsControllerFunction = function ($location, $rootScope, $routeParams, $scope, transferDetails) {

        $scope.init = function () {
            $scope.content = transferDetails;

            $('html, body').animate({
                scrollTop: 0
            }, 500);
        };



        $scope.init();
    };

    m.controller('TransferDetailsModalController', [
        '$location',
        '$rootScope',
        '$routeParams',
        '$scope',
        'transferDetails',
        transferDetailsControllerFunction
    ]);
})();
