(function () {
    'use strict';

    var m = angular.module('InvestmentDetailsCtrl', []);

    var investmentDetailsControllerFunction = function ($cookies, $location, $rootScope, $scope, ProductService, $document) {

        $scope.init = function () {
            $scope.getProducts();

            $('html, body').animate({
                scrollTop: 0
            }, 500);
        };

        $scope.getProducts = function () {
            ProductService.getCartDetail(sessionStorage.getItem("investmentCartName"))
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
                        rows.push({c: [{v: group.group}, {v: group.totalPercentWeight * 100}, {v: group.group + ' (' + group.totalPercentWeight * 100 + '%' + ')'}]})
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

        $scope.init();
    };

    m.controller('InvestmentDetailsController', [
        "$cookies",
        "$location",
        "$rootScope",
        "$scope",
        "ProductService",
        "$document",
        investmentDetailsControllerFunction
    ]);
})();
