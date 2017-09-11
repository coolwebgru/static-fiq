(function () {
    'use strict';

    var m = angular.module('OpenAccountCartCtrl', []);

    var openAccountCartControllerFunction = function ($cookies, $location, $rootScope, $scope, ProductService, $document, AccountService) {

        $scope.init = function () {
            if (!angular.fromJson(sessionStorage.getItem("responseProduct"))) {
                $location.path("/open-account-question-1");
            } else {
                $scope.investmentExperienced = sessionStorage.getItem("investmentExperience");
                
                if (angular.fromJson(sessionStorage.getItem("selectedProducts"))) {
                    $scope.selectedProducts = angular.fromJson(sessionStorage.getItem("selectedProducts"));
                    angular.forEach($scope.selectedProducts, function(selectedProduct) {
                        selectedProduct.selectedFlag = 0;
                        // $scope.getProducts(selectedProduct.productName);
                    });
                    $scope.selectedProducts[0].selectedFlag = 1
                    $scope.getProducts($scope.selectedProducts[0].productName);
                } else {
                    $scope.getProducts(angular.fromJson(sessionStorage.getItem("responseProduct")).productAssignments[0].productName);
                }

                $('html, body').animate({
                    scrollTop: 0
                }, 500);
            }
        };

        $scope.getProducts = function (productName) {
            console.log('productName', productName);
            ProductService.getCartDetail(productName)
                .then(function (cartDetail) {
                    console.log('product', cartDetail);
                    $scope.productName = cartDetail.response.description;
                    $scope.productDetails = cartDetail.response.details;
                    $scope.jsonTable = cartDetail.response;
                    angular.forEach($scope.jsonTable.holdings, function(holding) {
                        holding.selectedFlag = false;
                    });

                    ProductService.getProduct()
                        .then(function (products) {
                            $scope.jsonProduct = products.response.products.filter(
                                function (data) {
                                    return data.productName == $scope.jsonTable.productName
                                }
                            )[0];
                        });

                    var rows = [];

                    angular.forEach($scope.jsonTable.groups, function (group) {
                        rows.push(
                            {
                                c: [
                                    {v: group.group}, 
                                    {v: group.totalPercentWeight * 100}, 
                                    {v: group.group + ' (' + group.totalPercentWeight * 100 + '%' + ')'}
                                ]
                            }
                        )
                    });

                    $scope.chart = {
                        "type": "PieChart",
                        "cssStyle": "height: 130%; width:130%; margin-left: -15%; margin-top: -10%;",
                        
                        "data": {
                            cols: [
                                {
                                    id: "symbol",
                                    label: "Symbol",
                                    type: "string"
                                },
                                {
                                    id: "weight",
                                    label: "Weight",
                                    type: "number"
                                },
                                {
                                    type: "string",
                                    role: "tooltip"
                                }

                            ],
                            rows: rows,
                        },
                        "options": {
                            "tooltip": {},
                            "legend": "none",
                            "backgroundColor": 'transparent'
                        },
                        "displayed": true
                    }
                }
            );
        };

        $scope.selectProduct = function(productName) {
            angular.forEach($scope.selectedProducts, function(selectedProduct) {
                if (selectedProduct.productName == productName) {
                    selectedProduct.selectedFlag = 1;
                } else {
                    selectedProduct.selectedFlag = 0;
                }
            });
            $scope.getProducts(productName);
        };

        $scope.mouseoverHandler = function(row, col) {
            if ($scope.jsonTable) {
                angular.forEach($scope.jsonTable.holdings, function(holding) {
                    if ($scope.jsonTable.groups[row].group == holding.group) {
                        holding.selectedFlag = true;
                    } else {
                        holding.selectedFlag = false;
                    }
                });
            }
        };

        $scope.mouseoutHandler = function(row, col) {
            if ($scope.jsonTable) {
                angular.forEach($scope.jsonTable.holdings, function(holding) {
                    holding.selectedFlag = false;
                });
            }
        };



        $scope.showChoiceDetails = function(detailsId) {
            $location.path("/choice-details");
        };

        $scope.init();
    };

    m.controller('OpenAccountCartController', [
        "$cookies",
        "$location",
        "$rootScope",
        "$scope",
        "ProductService",
        "$document",
        "AccountService",
        openAccountCartControllerFunction
    ]);
})();
