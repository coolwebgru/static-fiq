(function () {
    'use strict';

    var m = angular.module('AccountSrvc', []);

    var getAccountServiceFunction = function ($http, $q, LoginService, $location) {

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

        var createAchRelationship = function(accountId, jsonRequest) {
            var def = $q.defer();

            $http.post("/api/v2/accounts/" + accountId + "/ach_relationships", jsonRequest)
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function (data, status) {
                    def.resolve(data);
                });

            return def.promise;
        };

        var getAchRelationship = function(accountId) {
            var def = $q.defer();

            $http.get("/api/v2/accounts/" + accountId + "/ach_relationships")
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function (data, status) {
                    def.resolve(data);
                });

            return def.promise;
        };

        var confirmAchRelationship = function(achRelationshipId, jsonRequest) {
            var def = $q.defer();

            $http.post("/api/v2/ach_relationships/" + achRelationshipId + "/confirm", jsonRequest)
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function (data, status) {
                    def.resolve(data);
                });

            return def.promise;
        };

        var createAchDeposit = function(achRelationshipId, jsonRequest) {
            var def = $q.defer();

            $http.post("/api/v2/ach_relationships/" + achRelationshipId + "/deposits", jsonRequest)
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function (data, status) {
                    def.resolve(data);
                });

            return def.promise;
        };

        var createAchWithdrawl = function(achRelationshipId, jsonRequest) {
            var def = $q.defer();

            $http.post("/api/v2/ach_relationships/" + achRelationshipId + "/withdrawals", jsonRequest)
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function (data, status) {
                    def.resolve(data);
                });

            return def.promise;
        };

        var deleteAch = function(achRelationshipId, jsonRequest) {
            var def = $q.defer();

            $http.post("/api/v2/ach_relationships/" + achRelationshipId + "/cancel", jsonRequest)
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function (data, status) {
                    def.resolve(data);
                });

            return def.promise;
        };

        var getTransfers = function(accountId) {
            var def = $q.defer();

            $http.get("/api/v2/accounts/" + accountId + "/transfers")
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function (data, status) {
                    def.resolve(data);
                });

            return def.promise;
        };

        var getSnapshots = function(accountId) {
            var def = $q.defer();

            $http.get("/api/v2/accounts/" + accountId + "/snapshot")
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function (data, status) {
                    def.resolve(data);
                });

            return def.promise;
        };

        var getHoldings = function(accountId) {
            var def = $q.defer();

            $http.get("/api/v2/accounts/" + accountId + "/holdings")
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function (data, status) {
                    def.resolve(data);
                });

            return def.promise;
        };

        var getTransferDetails = function(transferId) {
            var def = $q.defer();

            $http.get("/api/v2/transfers/" + transferId)
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function (data, status) {
                    def.resolve(data);
                });

            return def.promise;
        };

        var getHistoryTransactions = function(accountId) {
            var def = $q.defer();

            $http.get("/api/v2/accounts/" + accountId + "/history/transactions")
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function (data, status) {
                    def.resolve(data);
                });

            return def.promise;
        };

        var getHistoryTrades = function(accountId) {
            var def = $q.defer();

            $http.get("/api/v2/accounts/" + accountId + "/history/trades")
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function (data, status) {
                    def.resolve(data);
                });

            return def.promise;
        };

        var testToken = function() {
            var def = $q.defer();
            
            $http.get("/api/v2/auth/sessions/token_test")
                .success(function (data) {
                    if (data.status){
                        if (data.status.statusCode == "OK") {
                            def.resolve("OK");
                        }
                    } else {
                        def.resolve("Not Good");
                    }
                })
                .error(function (data, status) {
                    if (parseInt(status) === 401) {
                        def.resolve('Unauthorized'); // not authenticated
                    } else {
                        def.resolve("False"); // until we can do something with this
                    }
                });

            return def.promise;
        };

        var getDocuments = function(accountId) {
            var def = $q.defer();

            $http.get("/api/v2/accounts/" + accountId + "/documents")
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function (data, status) {
                    def.resolve(data);
                });

            return def.promise;
        };

        var asAuthenticated = function(next) {
            testToken()
            .then(function(response) {
                if (response == "Unauthorized") {
                    LoginService.popupLogin(next); // this is new in LoginService opens a modal dialog for login, so it needs a view (html) as well
                    // .then(function(response) {
                    //     if (response == "good") {
                    //         next();
                    //     } else {
                    //         $location.path("/");
                    //     }
                    //     // if response is good, next();
                    //     // if response is bad, $location.path to /
                    // });
                } else {
                    next();
                }
            });
        };


        // interface
        return {
            testToken: testToken,
            getCurrentUser: getCurrentUser,
            createAchRelationship: createAchRelationship,
            getAchRelationship: getAchRelationship,
            confirmAchRelationship: confirmAchRelationship,
            createAchDeposit: createAchDeposit,
            createAchWithdrawl: createAchWithdrawl,
            getTransfers: getTransfers,
            getSnapshots: getSnapshots,
            getHoldings: getHoldings,
            getTransferDetails: getTransferDetails,
            getHistoryTransactions: getHistoryTransactions,
            getHistoryTrades: getHistoryTrades,
            getDocuments: getDocuments,
            deleteAch: deleteAch,
            asAuthenticated: asAuthenticated
        };
    };

    m.factory('AccountService', [
        '$http',
        '$q',
        'LoginService',
        '$location',
        getAccountServiceFunction
    ]);
})();
