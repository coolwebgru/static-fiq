(function () {
    'use strict';

    var m = angular.module('ProductServiceModule', []);

    var productServiceFunction = function ($http, $q) {

        var product_url = "/api/v2/products";
        var detail_url = "/api/v2/products/";

        var productsCache = null;
        var productCache = {};

        var getProduct = function () {
            var def = $q.defer();

            if (productsCache != null) {
                def.resolve(productsCache);

            } else {
                $http.get("/api/v2/products")
                    .success(function (data) {
                        productsCache = data;
                        def.resolve(data);
                    })
                    .error(function () {
                        def.reject("Failed to get albums");
                    });
            }

            return def.promise;
        };

        var getCartDetail = function (productName) {
            var def = $q.defer();

            if (productCache[productName]) {
                def.resolve(productCache[productName]);

            } else {
                $http.get(detail_url + productName)
                    .success(function (data) {
                        productCache[productName] = data;
                        def.resolve(data);
                    })
                    .error(function () {
                        def.reject("Failed to get albums");
                    });
            }

            return def.promise;
        };

        // interface
        return {
            getCartDetail: getCartDetail,
            getProduct: getProduct
        };
    };

    m.factory('ProductService', [
        '$http',
        '$q',
        productServiceFunction
    ]);
})();
