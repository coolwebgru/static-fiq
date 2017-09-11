(function () {
    'use strict';

    var m = angular.module('SelectDataServiceModule', []);

    var selectDataServiceFunction = function ($http, $q) {

        var selectDataCache = null;

        var findByValue = function (listName, valueToFind) {
            var valueFound;

            if (selectDataCache.response[listName]) {
                var valuesFound = selectDataCache.response[listName].filter(function (item) {
                    return item.value === valueToFind;
                });

                if (valuesFound && valuesFound.length > 0) valueFound = valuesFound[0];
            }

            return valueFound;
        };

        var getSelectData = function () {
            var def = $q.defer();

            if (selectDataCache != null) {
                def.resolve(selectDataCache);

            } else {
                $http.get('/api/v2/select_data')
                    .success(function (data) {
                        selectDataCache = data;

                        selectDataCache.response.findByValue = findByValue;

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
            getSelectData: getSelectData
        };
    };

    m.factory('SelectDataService', [
        '$http',
        '$q',
        selectDataServiceFunction
    ]);
})();
