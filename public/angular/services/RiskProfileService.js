(function () {
    'use strict';

    var m = angular.module('RiskProfileServiceModule', []);

    var riskProfileServiceFunction = function ($http, $q) {

        var submitURL = '/api/v2/risk_profile';    // URL which is now live
        // var submitURL = 'test/samples/test_risk_profiler_response.json';    // test URL

        var getRiskProfile = function (jsonRequest) {
            var def = $q.defer();

            $http.post(submitURL, jsonRequest)
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function () {
                    def.reject("Failed to get albums");
                });

            return def.promise;
        };

        // interface
        return {
            getRiskProfile: getRiskProfile
        };
    };

    m.factory('RiskProfileService', [
        '$http',
        '$q',
        riskProfileServiceFunction
    ]);
})();
