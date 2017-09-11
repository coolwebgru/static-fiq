(function () {
    'use strict';

    var m = angular.module('AccountCtrl', []);

    var accountControllerFunction = function (NgTableParams, $cookies, $location, $rootScope, $scope, ProductService, $filter, $route, GetCurrentUserService, AccountService, SelectDataService, ModalService, TextService) {

        $scope.detailsInfo = {
            "PENDING": "Pending",
            "READY_TO_VERIFY": "Ready to Verify",
            "APPROVED": "Approved",
            "CANCELED": "Canceled",
            "VERIFICATION_PENDING": "Verification Pending",
            "CANCEL_PENDING": "Cancel Pending",
            "VERIFY_NEEDS_REISSUE": "Verify Needs Reissue"
        };

        $scope.boolInfo = {
            true: "Yes",
            false: "No"
        }

        $scope.firstAmount = [];
        $scope.secondAmount = [];
        var user_id;
        var achRelationshipArray = [];

        $scope.init = function () {

            if ($location.path() == '/account-overview') {
                sessionStorage.setItem("tableId", 0);
            }
            
            SelectDataService.getSelectData()
            .then(function (selectData) {
                $scope.selectData = selectData.response;
            },
            function (data) {
                console.log('selectData retrieval failed.')
            });
            
            AccountService.asAuthenticated(function() {
                GetCurrentUserService.getCurrentUser()
                .then(function(currentUser) {
                    console.log("current user", currentUser);
                
                    $scope.bankAccountHolderName = currentUser.response.accountHolders[0].firstName + " " + currentUser.response.accountHolders[0].lastName;
                    user_id = currentUser.response.id;

                    AccountService.getAchRelationship(user_id)
                    .then(function(response) {
                        console.log("achRelationship", response);
                        achRelationshipArray = response.response;
                        $scope.achRelationshipArray = achRelationshipArray;
                    });

                    var tableId;
                    if (sessionStorage.getItem("tableId")) {
                        tableId = sessionStorage.getItem("tableId");
                    } else {
                        tableId = 0;
                    }
                    $scope.loadWorkSpace(tableId);
                });
            });
                                  
            $scope.fundingActivityDateFrom = $filter('date')(new Date(), 'MM/dd/yyyy');

            $('html, body').animate({
                scrollTop: 0
            }, 500);
        };

        $scope.onClickBank = function(commonBankId) {

            AccountService.asAuthenticated(function() {
                $scope.bankRoutingNumber = parseInt("011500010");
            });
        };

        $scope.confirmAchRelationship = function(achRelationshipId) {

            AccountService.asAuthenticated(function() {
                var jsonRequest = {
                    "amount1": $scope.firstAmount[achRelationshipId],
                    "amount2": $scope.secondAmount[achRelationshipId]
                };
                AccountService.confirmAchRelationship(achRelationshipId, jsonRequest)
                .then(function(response) {
                    console.log("confirm AchRelationship", response);
                    if (response.status.statusCode == "OK") {
                        TextService.popup('confirm_achRelationship_success');
                        $route.reload();
                    }
                });
            });
        };

        $scope.onClickBtnDeposit = function(achRelationshipId) {

            AccountService.asAuthenticated(function() {
                sessionStorage.setItem("achRelationshipId", achRelationshipId);
                $rootScope.currentNickName = $scope.getNickNameByAchId(achRelationshipId);
                $location.path("/account-overview/deposit/");
            });
        };

        $scope.onClickBtnCancelDeposit = function(achRelationshipId) {
            AccountService.asAuthenticated(function() {
                var cancelAchDetails = {
                    "achRelationshipId": achRelationshipId,
                    "nickName": $scope.getNickNameByAchId(achRelationshipId)
                };

                ModalService.showModal({
                    templateUrl: 'views/investment/confirm_cancel_ach.html',
                    controller: "CancelAchDetailsController",
                    inputs: {
                        cancelAchDetails: cancelAchDetails
                    }
                }).then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {
                        $scope.message = "You said " + result;
                    });
                });
            });
        };

        $scope.depositAchRelationship = function() {

            AccountService.asAuthenticated(function() {
                var achRelationshipId = sessionStorage.getItem("achRelationshipId");

                var depositeDetails = {
                    "amount": $scope.depositAmount,
                    "achRelationshipId": achRelationshipId,
                    "nickName": $scope.getNickNameByAchId(achRelationshipId)
                };

                ModalService.showModal({
                    templateUrl: 'views/investment/confirm_deposite.html',
                    controller: "DepositeDetailsController",
                    inputs: {
                        depositeDetails: depositeDetails
                    }
                }).then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {
                        $scope.message = "You said " + result;
                    });
                });
            });
        };

        $scope.onClickBtnWithdraw = function(achRelationshipId) {

            AccountService.asAuthenticated(function() {
                sessionStorage.setItem("achRelationshipId", achRelationshipId);    
                $rootScope.currentNickName = $scope.getNickNameByAchId(achRelationshipId);
                $location.path("/account-overview/withdraw/");
            });
        };

        $scope.withdrawAchRelationship = function() {

            AccountService.asAuthenticated(function() {
                var achRelationshipId = sessionStorage.getItem("achRelationshipId");

                var withdrawDetails = {
                    "isFullBalance": $scope.isFullBalance,
                    "amount": $scope.withdrawAmount,
                    "nickName": $scope.getNickNameByAchId(achRelationshipId),
                    "achRelationshipId": achRelationshipId
                };

                ModalService.showModal({
                    templateUrl: 'views/investment/confirm_withdraw.html',
                    controller: "WithdrawDetailsController",
                    inputs: {
                        withdrawDetails: withdrawDetails
                    }
                }).then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {
                        $scope.message = "You said " + result;
                    });
                });
            });
        };

        $scope.postAchRelationship = function() {

            AccountService.asAuthenticated(function() {
                var accountDetails = {
                    "bankAccountType": $scope.bankAccountType.value,
                    "bankRoutingNumber": $scope.bankRoutingNumber,
                    "bankAccountNumber": $scope.bankAccountNumber,
                    "bankAccountHolderName": $scope.bankAccountHolderName,
                    "bankAccountNickname": $scope.bankAccountNickname
                };

                ModalService.showModal({
                    templateUrl: 'views/investment/confirm_account.html',
                    controller: "AccountDetailsController",
                    inputs: {
                        accountDetails: accountDetails
                    }
                }).then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {
                        $scope.message = "You said " + result;
                    });
                });
            });
        };

        $scope.getProducts = function () {
            
        };

        $scope.accountNavTables =
            [
                {id: 1, name: "account-table-nav-1", active: false},
                {id: 2, name: "account-table-nav-2", active: false},
                {id: 3, name: "account-table-nav-3", active: false},
                {id: 4, name: "account-table-nav-4", active: false},
                {id: 5, name: "account-table-nav-5", active: false},
                {id: 6, name: "account-table-nav-6", active: false}
            ];

        var deselectAll = function() {
            angular.forEach($scope.accountNavTables, function(item) {
                item.active = false;
                var tableElement = angular.element( document.querySelector("#" + item.name) );
                tableElement.removeClass("account-active-tab");
            });
        };

        $scope.getNickNameByAchId = function(ach_id) {
            var result;
            angular.forEach(achRelationshipArray, function(achDetail) {
                if (achDetail.id == ach_id) {
                    result = achDetail.nickname;
                    return false;
                }
            });
            return result;
        };

        $scope.loadWorkSpace = function(tableId) {
            if (tableId == 0) {
                AccountService.asAuthenticated(function() {

                    AccountService.getSnapshots(user_id)
                    .then(function(response) {
                        console.log("snapshots", response);
                        $scope.snapshots = response.response;
                        if ($scope.snapshots != null) {
                            var rows = [];
                            angular.forEach(response.response.history, function(historyDetail) {
                                rows.push(
                                    { 
                                        c: [
                                            {v: new Date(historyDetail.ledgerDate) },
                                            {v: historyDetail.totalEquity }, 
                                            {v: historyDetail.totalMarketValue }
                                        ]
                                    }
                                );
                            });
                            $scope.lineChart = {
                                "type": "LineChart",
                                "displayed": true,
                                "data": {
                                    cols: [
                                        {
                                            label: "Date",
                                            type: "date",
                                        },
                                        {
                                            label: "Total Equity",
                                            type: "number",
                                        },
                                        {
                                            label: "Total Market Value",
                                            type: "number",
                                        },
                                    ],
                                    rows: rows
                                },
                                "options": {
                                    "title": "Graph of History",
                                    "isStacked": "true",
                                    "displayExactValues": true,
                                    "vAxis": {
                                        "title": "Total Equity & Total Market Value",
                                    },
                                    "hAxis": {
                                        "title": "Date", // <-- this comma
                                    }
                                },
                            };
                        }

                    });

                });
                

            } else if (tableId == 1) {

                AccountService.asAuthenticated(function() {
                    AccountService.getHistoryTransactions(user_id)
                    .then(function(response) {
                        console.log("historyTransactions", response);
                        $scope.historyTransactions = response.response;
                        $scope.historyTransactionsParams = new NgTableParams({page: 1, count: 5}, {dataset: $scope.historyTransactions});
                    });

                    AccountService.getHistoryTrades(user_id)
                    .then(function(response) {
                        console.log("historyTrades", response);
                        $scope.historyTrades = response.response;
                        $scope.historyTradeParams = new NgTableParams({page: 1, count: 5}, {dataset: $scope.historyTrades});
                    });
                });
            } else if ((tableId == 4) || (tableId == 5)) {

                AccountService.asAuthenticated(function() {
                    AccountService.getSnapshots(user_id)
                    .then(function(response) {
                        $scope.snapshots = response.response;
                        console.log("snapshots", response);
                    });
                });
                        
            } else if (tableId == 2) {

                AccountService.asAuthenticated(function() {
                    AccountService.getTransfers(user_id)
                    .then(function(response) {
                        console.log("getTransfers", response);
                        $scope.transfersArray = response.response;
                        $scope.defaultTransferArray = response.response;
                    });
                });
                        
            } else if (tableId == 3) {

                AccountService.asAuthenticated(function() {
                    AccountService.getHoldings(user_id)
                    .then(function(response) {
                        console.log("holdings", response);
                        $scope.holdings = response.response;
                        $scope.holdingTableParams = new NgTableParams({page: 1, count: 5}, {dataset: $scope.holdings});
                    });
                });
                        
            } else if (tableId == 6) {
                AccountService.asAuthenticated(function() {
                    AccountService.getDocuments(user_id)
                    .then(function(response) {
                        console.log("documents", response);
                        $scope.documents = response.response;
                        $scope.documentsTableParams = new NgTableParams({page: 1, count: 5}, {dataset: $scope.documents});
                    });
                });
                
            }
            // var tableElement = angular.element(document.querySelector("#" + $scope.accountNavTables[tableId].name));
            // tableElement.addClass("account-active-tab");

            $('html, body').animate({
                scrollTop: 0
            }, 500);
        }

        $scope.activeAccountTableNav = function(tableId) {


            sessionStorage.setItem("tableId", tableId);
            // deselectAll();
            // $scope.accountNavTables[tableId].active = true;
            
                    
        };

        $scope.onClickTransferDetails = function(transferId) {

            AccountService.asAuthenticated(function() {
                AccountService.getTransferDetails(transferId)
                .then(function(response) {
                    console.log("transferDetails", response);
                    if (response.status.statusCode == "OK") {
                        ModalService.showModal({
                            templateUrl: 'views/investment/trasnferDetails.html',
                            controller: "TransferDetailsModalController",
                            inputs: {
                                transferDetails: response.response
                            }
                        }).then(function(modal) {
                            modal.element.modal();
                            modal.close.then(function(result) {
                                $scope.message = "You said " + result;
                            });
                        });
                    } else {
                        TextService.popup('tranfer_detail_failed');
                    }
                        
                });
                $('html, body').animate({
                    scrollTop: 0
                }, 500);
            });
                    
        };

        var getWeek = function(date) {
            date = new Date(date);
            date.setHours(0,0,0,0);
            // Set to nearest Thursday: current date + 4 - current day number
            // Make Sunday's day number 7
            date.setDate(date.getDate() + 4 - (date.getDay()||7));
            // Get first day of year
            var yearStart = new Date(date.getFullYear(),0,1);
            // Calculate full weeks to nearest Thursday
            var weekNo = Math.ceil(( ( (date - yearStart) / 86400000) + 1)/7);

            return weekNo;
        }

        var getQuarter = function(date) {
            date = new Date(date);
            var q = [4,1,2,3];
            return q[Math.floor(date.getMonth() / 3)];
        }

        $scope.compareByWeek = function() {
            var currentDate = new Date();
            var newTransactions = [];
            var newTrades = [];
            angular.forEach($scope.historyTransactions, function(transaction) {
                if (getWeek(currentDate) == getWeek(transaction.ledgerDate)) {
                    newTransactions.push(transaction);
                }
            });
            angular.forEach($scope.historyTrades, function(trade) {
                if (getWeek(currentDate) == getWeek(trade.tradeDate)) {
                    newTrades.push(trade);
                }
            });
            $scope.historyTransactionsParams = new NgTableParams({page: 1, count: 5}, {dataset: newTransactions});
            $scope.historyTradeParams = new NgTableParams({page: 1, count: 5}, {dataset: newTrades});
        };

        $scope.compareByMonth = function() {
            var currentDate = new Date();

            var newTransactions = [];
            var newTrades = [];

             angular.forEach($scope.historyTransactions, function(transaction) {
                if (currentDate.getMonth() == (new Date(transaction.ledgerDate).getMonth())) {
                    newTransactions.push(transaction);
                }
            });
            angular.forEach($scope.historyTrades, function(trade) {
                if (currentDate.getMonth() == (new Date(trade.tradeDate).getMonth())) {
                    newTrades.push(trade);
                }
            });

            $scope.historyTransactionsParams = new NgTableParams({page: 1, count: 5}, {dataset: newTransactions});
            $scope.historyTradeParams = new NgTableParams({page: 1, count: 5}, {dataset: newTrades});
        }

        $scope.compareByQuarter = function() {
            var currentDate = new Date();
            var newTransactions = [];
            var newTrades = [];
            angular.forEach($scope.historyTransactions, function(transaction) {
                if (getQuarter(currentDate) == getQuarter(transaction.ledgerDate)) {
                    newTransactions.push(transaction);
                }
            });
            angular.forEach($scope.historyTrades, function(trade) {
                if (getQuarter(currentDate) == getQuarter(trade.tradeDate)) {
                    newTrades.push(trade);
                }
            });
            $scope.historyTransactionsParams = new NgTableParams({page: 1, count: 5}, {dataset: newTransactions});
            $scope.historyTradeParams = new NgTableParams({page: 1, count: 5}, {dataset: newTrades});
        };

        $scope.showAllHistory = function() {
            $scope.historyTransactionsParams = new NgTableParams({page: 1, count: 5}, {dataset: $scope.historyTransactions});
            $scope.historyTradeParams = new NgTableParams({page: 1, count: 5}, {dataset: $scope.historyTrades});
        };

        $scope.showLastThirty = function() {
            var currentDate = new Date();

            var startDate = new Date(currentDate.getTime() - 30*24*60*60*1000);

            var newTransactions = [];
            var newTrades = [];
            angular.forEach($scope.historyTransactions, function(transaction) {
                if (startDate < (new Date(transaction.ledgerDate))) {
                    newTransactions.push(transaction);
                }
            });
            angular.forEach($scope.historyTrades, function(trade) {
                if (startDate < (new Date(trade.tradeDate))) {
                    newTrades.push(trade);
                }
            });
            $scope.historyTransactionsParams = new NgTableParams({page: 1, count: 5}, {dataset: newTransactions});
            $scope.historyTradeParams = new NgTableParams({page: 1, count: 5}, {dataset: newTrades});
        };

        $scope.showLastSixty = function() {
            var currentDate = new Date();

            var startDate = new Date(currentDate.getTime() - 60*24*60*60*1000);

            var newTransactions = [];
            var newTrades = [];
            angular.forEach($scope.historyTransactions, function(transaction) {
                if (startDate < (new Date(transaction.ledgerDate))) {
                    newTransactions.push(transaction);
                }
            });
            angular.forEach($scope.historyTrades, function(trade) {
                if (startDate < (new Date(trade.tradeDate))) {
                    newTrades.push(trade);
                }
            });
            $scope.historyTransactionsParams = new NgTableParams({page: 1, count: 5}, {dataset: newTransactions});
            $scope.historyTradeParams = new NgTableParams({page: 1, count: 5}, {dataset: newTrades});
        };

        $scope.showLastNinety = function() {
            var currentDate = new Date();

            var startDate = new Date(currentDate.getTime() - 90*24*60*60*1000);

            var newTransactions = [];
            var newTrades = [];
            angular.forEach($scope.historyTransactions, function(transaction) {
                if (startDate < (new Date(transaction.ledgerDate))) {
                    newTransactions.push(transaction);
                }
            });
            angular.forEach($scope.historyTrades, function(trade) {
                if (startDate < (new Date(trade.tradeDate))) {
                    newTrades.push(trade);
                }
            });
            $scope.historyTransactionsParams = new NgTableParams({page: 1, count: 5}, {dataset: newTransactions});
            $scope.historyTradeParams = new NgTableParams({page: 1, count: 5}, {dataset: newTrades});
        };

        $scope.showAllTransfer = function() {
            $scope.transfersArray = $scope.defaultTransferArray;
        };

        $scope.showWeekTransfer = function() {
            var currentDate = new Date();
            var newTransfer = [];
            angular.forEach($scope.defaultTransferArray, function(transfer) {
                if (getWeek(currentDate) == getWeek(transfer.updatedAt)) {
                    newTransfer.push(transfer);
                }
            });
            $scope.transfersArray = newTransfer;
        };

        $scope.showMonthTransfer = function() {
            var currentDate = new Date();
            var newTransfer = [];
            angular.forEach($scope.defaultTransferArray, function(transfer) {
                if (currentDate.getMonth() == (new Date(transfer.updatedAt)).getMonth()) {
                    newTransfer.push(transfer);
                }
            });
            $scope.transfersArray = newTransfer;
        };

        $scope.showQuarterTransfer = function() {
            var currentDate = new Date();
            var newTransfer = [];
            angular.forEach($scope.defaultTransferArray, function(transfer) {
                if (getQuarter(currentDate) == getQuarter(transfer.updatedAt)) {
                    newTransfer.push(transfer);
                }
            });
            $scope.transfersArray = newTransfer;
        };

        $scope.showLastDayTransfer = function(day) {
            var currentDate = new Date();
            var startDate = new Date(currentDate.getTime() - day*24*60*60*1000);
            var newTransfer = [];
            angular.forEach($scope.defaultTransferArray, function(transfer) {
                if (startDate < (new Date(transfer.updatedAt))) {
                    newTransfer.push(transfer);
                }
            });
            $scope.transfersArray = newTransfer;
        };

        $scope.onClick_isFullBalance = function() {
            if ($scope.isFullBalance) {
                var amount = Math.round($scope.snapshots.availableCash * 100);
                $scope.withdrawAmount = amount / 100;
                $scope.withdrawInputFlag = true;
            } else {
                $scope.withdrawAmount = 0;
                $scope.withdrawInputFlag = false;
            }
        };

        $scope.init();
    };

    m.controller('AccountController', [
        "NgTableParams",
        "$cookies",
        "$location",
        "$rootScope",
        "$scope",
        "ProductService",
        "$filter",
        "$route",
        "GetCurrentUserService",
        "AccountService",
        "SelectDataService",
        "ModalService",
        "TextService",
        accountControllerFunction
    ]);
})();
