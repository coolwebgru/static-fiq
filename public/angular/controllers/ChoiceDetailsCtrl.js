(function () {
    'use strict';

    var m = angular.module('ChoiceDetailsCtrl', []);

    var choiceDetailsControllerFunction = function ($cookies, $location, $rootScope, $scope, ProductService, $document) {

        $scope.init = function () {
            $scope.getProducts();

            $('html, body').animate({
                scrollTop: 0
            }, 500);
        };

        $scope.masterScoreSlider = {
            minValue: 10,
            maxValue: 100,
            options: {
                floor: 0,
                ceil: 100,
                step: 1
            }
        };

        $scope.betaRangeSlider = {
            minValue: 0.88,
            maxValue: 1.05,
            options: {
                floor: 0.6,
                ceil: 1.3,
                step: 0.01,
                precision: 2
            }
        };

        $scope.marketCapRangeSlider = {
            minValue: 6,
            maxValue: 50,
            options: {
                floor: 0,
                ceil: 70,
                step: 1,
                translate: function(value) {
                    if (value < 10) {
                        return '$' + value + '00 mln';
                    } else if (value >= 10) {
                        return '$' + value/10 + ' bln';
                    }
                }
            }
        };

        $scope.safteScoreRangeSlider = {
            minValue: 35,
            maxValue: 55,
            options: {
                floor: 0,
                ceil: 60,
                step: 1,
                translate: function(value) {
                    if (value < 20) {
                        return 'Low' + '<br>' + 'Safety' ;
                    } else if ((value >= 20) && (value < 40)) {
                        return 'Moderate' + '<br>' + 'Safety';
                    } else if (value >= 40) {
                        return 'High' + '<br>' + 'Safety';
                    }
                }
            }
        };

        $scope.dividendYieldRangeSlider = {
            minValue: 2.5,
            maxValue: 4,
            options: {
                floor: 0,
                ceil: 6,
                step: 0.1,
                precision: 1,
                translate: function(value) {
                    return value + '%';
                }
            }
        };

        $scope.earningsGrowRatioSlider = {
            minValue: 0.98,
            maxValue: 1.3,
            options: {
                floor: 0.8,
                ceil: 1.5,
                step: 0.01,
                precision: 2,
            }
        };

        $scope.getProducts = function () {
            ProductService.getCartDetail(sessionStorage.getItem("adpCartName"))
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

    m.controller('ChoiceDetailsController', [
        "$cookies",
        "$location",
        "$rootScope",
        "$scope",
        "ProductService",
        "$document",
        choiceDetailsControllerFunction
    ]);
})();
