(function () {
    'use strict';

    var m = angular.module('SignUpSrvc', []);

    var signUpServiceFunction = function ($http, $q) {

        var retrieveEmail = function (token) {
            var def = $q.defer();

            $http.get("/api/v2/auth/create_tokens/" + token)
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function () {
                    def.reject("Failed to get albums");
                });

            return def.promise;
        };

        var createLogin = function (token, password) {
            var def = $q.defer();

            $http.post("/api/v2/auth/create_tokens/" + token + "/logins", password)
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function () {
                    def.reject("Failed");
                });

            return def.promise
        };

        // interface
        return {
            retrieveEmail: retrieveEmail,
            createLogin: createLogin
        };
    };

    m.factory('SignUpService', [
        '$http',
        '$q',
        signUpServiceFunction
    ]);
})();
