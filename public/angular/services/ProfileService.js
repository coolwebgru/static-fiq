(function () {
    'use strict';

    var m = angular.module('ProfileSrvc', []);

    var getProfileServiceFunction = function ($http, $q) {

        var getProfileDetail = function(accountId) {
            var def = $q.defer();

            $http.get("/api/v2/accounts/" + accountId + "/details")
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function (data, status) {
                    def.resolve(data);
                });

            return def.promise;
        };

        var patchUpdate = function(accountId, jsonRequest) {
            var def = $q.defer();

            $http.patch("/api/v2/accounts/" + accountId, jsonRequest)
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
            getProfileDetail: getProfileDetail,
            patchUpdate: patchUpdate
        };
    };

    m.factory('ProfileService', [
        '$http',
        '$q',
        getProfileServiceFunction
    ]);
})();
