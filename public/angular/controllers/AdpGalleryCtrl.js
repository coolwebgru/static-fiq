(function () {
    'use strict';

    var m = angular.module("AdpGalleryCtrl", []);

    var adpGalleryControllerFunction = function ($route, $location, $rootScope, $routeParams, $scope, TextService, ProductService) {

        $scope.init = function () {
            ProductService.getProduct()
            .then(function(response) {
                console.log("allProducts", response);
                $scope.products = response.response;
                angular.forEach($scope.products.products, function(product) {
                });
            });
            $('html, body').animate({
                scrollTop: 0
            }, 500);
        };

        $scope.onCartDetails = function(productName) {
            sessionStorage.setItem("adpCartName", productName);
            $location.path("/adp-cart-details");
        };



        $scope.init();
    };

    m.controller('AdpGalleryController', [
        '$route',
        '$location',
        '$rootScope',
        '$routeParams',
        '$scope',
        'TextService',
        'ProductService',
        adpGalleryControllerFunction
    ]);
})();
