(function () {
    'use strict';

    var m = angular.module('InvestmentChoicesCtrl', []);

    var investmentChoicesControllerFunction = function ($cookies, $location, $rootScope, $scope, ProductService, $document, TextService) {

        $scope.init = function () {
            $scope.availableProducts = [];
            var intAvailableProductId = 1;
            if (sessionStorage.getItem("availableProducts")) {
                $scope.availableProducts = angular.fromJson(sessionStorage.getItem("availableProducts"));
                console.log("existing availableProducts", $scope.availableProducts);
            } else {
                if (angular.fromJson(sessionStorage.getItem("responseProduct")).availableProducts) {
                    var availableProducts = angular.fromJson(sessionStorage.getItem("responseProduct")).availableProducts;
                    var productAssignments = angular.fromJson(sessionStorage.getItem("responseProduct")).productAssignments;
                    var investmentExperienced = sessionStorage.getItem("investmentExperience");
                    $scope.investmentExperienced = sessionStorage.getItem("investmentExperience");
                    ProductService.getProduct()
                    .then(function(response) {
                        console.log("allProducts", response);
                        var products = response.response;
                        if (investmentExperienced == "GOOD") {
                            angular.forEach(products.products, function(product) {
                                angular.forEach(availableProducts, function(availableProduct) {
                                        
                                    if ((availableProduct == product.productName)) {
                                        product.selectPercentage = 0;
                                        product.id = intAvailableProductId;
                                        intAvailableProductId++;
                                        $scope.availableProducts.push(product);
                                    }
                                });
                                if (product.productName == productAssignments[0].productName) {
                                    product.selectPercentage = 100;
                                    product.id = 0;
                                    $scope.availableProducts.push(product);

                                }
                            });
                        } else if (investmentExperienced == "EXTENSIVE") {
                            angular.forEach(products.products, function(product) {
                                product.selectPercentage = 0;
                                if (product.productName == productAssignments[0].productName) {
                                    product.selectPercentage = 100;
                                }
                                $scope.availableProducts.push(product);
                            });
                        }                        
                        console.log('availableProducts', $scope.availableProducts);
                    });
                }
            }
                
            $('html, body').animate({
                scrollTop: 0
            }, 500);
        };

        $scope.totalPercent = function() {
            var totalPercentage = 0;
            angular.forEach($scope.availableProducts, function(availableProduct) {
                totalPercentage = totalPercentage + availableProduct.selectPercentage;
            });
            return totalPercentage;
        };

        $scope.onOk = function(input) {
            if (input == 100) {
                sessionStorage.setItem("availableProducts", angular.toJson($scope.availableProducts));
                var selectedProducts = [];
                angular.forEach($scope.availableProducts, function(availableProduct) {
                    if (availableProduct.selectPercentage > 0) {
                        selectedProducts.push(availableProduct);
                    }
                });
                sessionStorage.setItem("selectedProducts", angular.toJson(selectedProducts));
                $location.path('/open-account-cart');
            } else if (input !=100) {
                TextService.popup("percentageError");
            }
                
        };

        $scope.cancel = function() {
            $location.path('/open-account-cart');
        };

        $scope.parseInt = function(decimal) {
            return Math.floor(decimal);
        };

        $scope.ceilInt = function(decimal) {
            return Math.ceil(decimal);
        }

        $scope.fixit = function(totalPercentage) {
            var selectedProducts = [];
            var nextTotalPercentage = 0;
            angular.forEach($scope.availableProducts, function(availableProduct) {
                if (availableProduct.selectPercentage > 0) {
                    availableProduct.selectPercentage = Math.round(availableProduct.selectPercentage * 100 / totalPercentage, 0);
                    selectedProducts.push(availableProduct);
                }
            });
            var min = Math.round(Math.min.apply(Math, selectedProducts.map(function(item){return item.selectPercentage;})), 0);
            var max = Math.round(Math.max.apply(Math, selectedProducts.map(function(item){return item.selectPercentage;})), 0);
            console.log("min", min);
            console.log("max", max);

            angular.forEach($scope.availableProducts, function(availableProduct) {
                nextTotalPercentage = nextTotalPercentage + availableProduct.selectPercentage;
            });

            var keepGoing = true;
            var loopFlag = true;
            // while (loopFlag) {
                if (nextTotalPercentage < 100) {
                    angular.forEach($scope.availableProducts, function(availableProduct) {
                        if(keepGoing) {
                            if (availableProduct.selectPercentage == min) {
                                availableProduct.selectPercentage = availableProduct.selectPercentage + 1;
                                keepGoing = false;
                                nextTotalPercentage++;
                                if (nextTotalPercentage == 100) {
                                    loopFlag = false;
                                }
                            }
                        }
                    });
                } else if (nextTotalPercentage > 100) {
                    angular.forEach($scope.availableProducts, function(availableProduct) {
                        if(keepGoing) {
                            if (availableProduct.selectPercentage == max) {
                                availableProduct.selectPercentage = availableProduct.selectPercentage - 1;
                                keepGoing = false;
                                nextTotalPercentage--;
                                if (nextTotalPercentage == 100) {
                                    loopFlag = false;
                                }
                            }
                        }
                    });
                }
            // };
                

        };

        $scope.slider = {
            options: {
                floor: 0,
                ceil: 100,
                step: 1
            }
        };

        $scope.onCartDetails = function(productName) {
            sessionStorage.setItem("investmentCartName", productName);
            $location.path("/investment-details");
        };

        $scope.init();
    };

    m.controller('InvestmentChoicesController', [
        "$cookies",
        "$location",
        "$rootScope",
        "$scope",
        "ProductService",
        "$document",
        "TextService",
        investmentChoicesControllerFunction
    ]);
})();
