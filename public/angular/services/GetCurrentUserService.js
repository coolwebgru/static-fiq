(function () {
    'use strict';

    var m = angular.module('GetCurrentUserSrvc', []);

    var getCurrentUserServiceFunction = function ($http, $q) {

        var getCurrentUser = function () {
            var def = $q.defer();

            $http.get("/api/v2/accounts/current")
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function (data, status) {
                    def.resolve(data);
                });

            return def.promise;
        };

        var getProductFromId = function (userID) {
            var def = $q.defer();

            $http.get("/api/v2/accounts/" + userID + "/risk_profile")
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function (data, status) {
                    def.resolve(data);
                });

            return def.promise;
        };

        // interface
        return {
            getCurrentUser: getCurrentUser,
            getProductFromId: getProductFromId
        };
    };

    m.factory('GetCurrentUserService', [
        '$http',
        '$q',
        getCurrentUserServiceFunction
    ]);
})();
