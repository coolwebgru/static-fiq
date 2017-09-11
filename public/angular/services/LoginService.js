(function () {
    'use strict';

    var m = angular.module('LoginSrvc', []);

    var loginServiceFunction = function ($http, $q, ModalService) {

        var createSession = function (requestJSON) {
            var def = $q.defer();

            $http.post("/api/v2/auth/sessions", requestJSON)
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function () {
                    def.reject("Failed");
                });

            return def.promise
        };

        var logout = function () {
            var def = $q.defer();

            $http.delete("/api/v2/auth/sessions")
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function () {
                    def.reject("Failed");
                });

            return def.promise;
        };

        var changePassword = function (requestJSON) {
            var def = $q.defer();

            $http.post("/api/v2/auth/sessions/change_login_password", requestJSON)
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function () {
                    def.reject("Failed");
                });

            return def.promise;
        };

        var popupLogin = function(next) {
            ModalService.showModal({
                templateUrl: 'views/loginModal.html',
                controller: "LoginModalController",
                inputs: {
                    next: next
                }
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    console.log("close", result);
                });
            });
        };

        // interface
        return {
            createSession: createSession,
            logout: logout,
            changePassword: changePassword,
            popupLogin: popupLogin
        };
    };

    m.factory('LoginService', [
        '$http',
        '$q',
        'ModalService',
        loginServiceFunction
    ]);
})();
