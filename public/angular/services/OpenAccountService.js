(function () {
    'use strict';

    var m = angular.module('OpenAccountServiceModule', []);

    var openAccountServiceFunction = function ($http, $q, $window) {

        var saveAccounts = function (jsonObj) {
            $window.location.href = '#/open-account-cart';
            var def = $q.defer();
            $http.post('/saveOpenAccount', jsonObj)
                .success(function (data, status) {
                    return 'successed';
                })
                .error(function () {
                    return 'failed';
                });
            return def.promise;
        };

        var letterUpload = function (file) {
            var fd = new FormData();
            //Take the first selected file
            fd.append("file", file);
            console.log(fd);
            $http.post("/upload", fd, {
                withCredentials: true,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            })
                .success(function () {
                    return "successed";
                }).error(function () {
                return "failed";
            });
        };

        var postWIP = function (postJSON) {
            console.log(postJSON);
            var def = $q.defer();

            $http.post('/api/v2/work_in_progress?email=' + postJSON.accountApplication.applicants[0].emailAddresses[0], postJSON)
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function () {
                    console.log('failed');

                    def.reject("Failed to get albums");
                });
            return def.promise;
        };

        var getWIP = function (email, pin) {
            var def = $q.defer();

            $http.get('/api/v2/work_in_progress?email=' + email + '&pin=' + pin)
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function () {
                    console.log('failed');

                    def.reject("Failed to get albums");
                });
            return def.promise;
        };

        var postPIN = function (email) {
            var def = $q.defer();

            $http.post('/api/v2/work_in_progress/pin_request?email=' + email)
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function () {
                    console.log('failed');

                    def.reject("Failed to get albums");
                });
            return def.promise;
        };

        var uploadFile = function (WIPItemId, requestLetter) {
            var def = $q.defer();

            console.log(requestLetter);

            $http.post('/api/v2/work_in_progress/' + WIPItemId + '/binary_resources', requestLetter)
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function () {
                    def.reject("Failed to get albums");
                });
            return def.promise;
        };

        var updateWIP = function (WIPItemId, updateJSON) {
            var def = $q.defer();
            // console.log(WIPItemId);
            $http.put('/api/v2/work_in_progress/' + WIPItemId, updateJSON)
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function () {
                    def.reject("Failed to get albums");
                });
            return def.promise;
        };

        var validateWIP = function(WIPItemId) {
            var def = $q.defer();
            // console.log(WIPItemId);
            $http.get('/api/v2/work_in_progress/' + WIPItemId + '/validate')
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function () {
                    def.reject("Failed to get albums");
                });
            return def.promise;
        };

        var getAgreement = function (WIPItemId, requestJSON) {
            var def = $q.defer();
            // console.log(WIPItemId);
            $http.post('/api/v2/agreements/' + WIPItemId, requestJSON)
                .success(function (data) {
                    console.log(WIPItemId);
                    def.resolve(data);
                })
                .error(function () {
                    def.reject("Failed to get albums");
                });
            return def.promise;
        };

        var executeAgreement = function (WIPItemId) {
            var def = $q.defer();
            $http.put('/api/v2/agreements/' + WIPItemId + '/execute')
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function () {
                    def.reject("Failed to get albums");
                });
            return def.promise;
        };

        var finalize = function (WIPItemId, requestJSON) {
            var def = $q.defer();
            $http.put('/api/v2/work_in_progress/' + WIPItemId + '/finalize', requestJSON)
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
            saveAccounts: saveAccounts,
            letterUpload: letterUpload,
            postWIP: postWIP,
            updateWIP: updateWIP,
            uploadFile: uploadFile,
            getAgreement: getAgreement,
            executeAgreement: executeAgreement,
            finalize: finalize,
            postPIN: postPIN,
            getWIP: getWIP,
            validateWIP: validateWIP
        };
    };

    m.factory('OpenAccountService', [
        '$http',
        '$q',
        '$window',
        openAccountServiceFunction
    ]);
})();
