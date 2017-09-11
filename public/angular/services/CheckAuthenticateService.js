(function () {
    'use strict';

    var m = angular.module('CheckAuthenticateSrvc', []);

    var checkAuthenticateServiceFunction = function ($http, $q) {

        var checkAuthenticate = function () {
            var def = $q.defer();

            $http.get("/api/v2/auth/sessions/token_test")
                .success(function (data) {
                    if (data.status){
                        if (data.status.statusCode == "OK") {
                            def.resolve(true);
                        }
                    } else {
                        def.resolve(false);
                    }
                })
                .error(function (data, status) {
                    if (parseInt(status) === 401) {
                        def.resolve(false); // not authenticated
                    } else {
                        def.resolve(false); // until we can do something with this
                    }
                });

            return def.promise;
        };

        // interface
        return {
            checkAuthenticate: checkAuthenticate
        };
    };

    m.factory('CheckAuthenticateService', [
        '$http',
        '$q',
        checkAuthenticateServiceFunction
    ]);
})();
