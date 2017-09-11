(function () {
    'use strict';

    var m = angular.module("ProfileCtrl", []);

    var profileControllerFunction = function (AccountService, $location, $rootScope, $routeParams, $scope, LoginService, TextService, GetCurrentUserService, ProfileService, SelectDataService) {

        var user_id;
        $scope.firstApplicant = [];
        $scope.secondApplicant = [];

        $scope.init = function () {

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
                    if (currentUser) {
                        user_id = currentUser.response.id;
                        if (sessionStorage.getItem("profileTableId")) {
                            var tableId = sessionStorage.getItem("profileTableId");
                            $scope.loadWorkspace(tableId);
                        } else {
                            $scope.loadWorkspace(0);
                        }
                    } else {
                        sessionStorage.setItem("beforeURL", "/profile");
                        $location.path("/");
                        $rootScope.login_flag = false;
                    }
                });
            });
            

            $('html, body').animate({
                scrollTop: 0
            }, 500);
        };

        $scope.changePassword = function () {
            AccountService.asAuthenticated(function() {
                if ($scope.userNewPassword == $scope.userNewConfirmPassword) {
                    var requestJSON = {
                        password: $scope.userOldPassword,
                        newPassword: $scope.userNewPassword
                    };
                    LoginService.changePassword(requestJSON)
                        .then(function (response) {
                            console.log(response);
                            if (response.status.statusCode == "OK") {
                                TextService.popup('change_password_success');
                                $location.path("/");
                            }
                            else {
                                TextService.popup('change_password_failure', { data: [ response.status.statusDescription ] });
                            }
                        });
                } else {
                    TextService.popup('change_password_mismatch');
                }
            });
     
        };

        $scope.activeWorkspaces = [
            {id: 1, name: "profile-table-nav-1", active: false},
            {id: 2, name: "profile-table-nav-2", active: false},
            {id: 3, name: "profile-table-nav-3", active: false},
        ];

        var deselectAll = function() {
            angular.forEach($scope.activeWorkspaces, function(workspaceDetail) {
                workspaceDetail.active = false;
                var tableElement = angular.element(document.querySelector("#" + workspaceDetail.name));
                tableElement.removeClass("account-active-tab");
            });
        };

        $scope.loadWorkspace = function(tableId) {
            if ((tableId == 0) || (tableId == 1)) {
                AccountService.asAuthenticated(function() {
                    ProfileService.getProfileDetail(user_id)
                    .then(function(response) {
                        console.log("profileDetails", response);
                        $scope.profileDetails = response.response;
                        if (tableId == 0) {
                            $scope.firstApplicant.firstName = $scope.profileDetails.accountHolders[0].givenName;
                            $scope.firstApplicant.lastName = $scope.profileDetails.accountHolders[0].familyName;
                            $scope.firstApplicant.homeAddressCountry = $scope.selectData.findByValue('countries', $scope.profileDetails.accountHolders[0].homeAddress[0].country);
                            $scope.firstApplicant.homeAddressCity = $scope.profileDetails.accountHolders[0].homeAddress[0].city;
                            $scope.firstApplicant.homeAddressState = $scope.selectData.findByValue('states', $scope.profileDetails.accountHolders[0].homeAddress[0].state);
                            $scope.firstApplicant.homeAddressPostal = $scope.profileDetails.accountHolders[0].homeAddress[0].postalCode;
                            $scope.firstApplicant.homeAddressLine = $scope.profileDetails.accountHolders[0].homeAddress[0].streetAddress[0];

                            $scope.firstApplicant.profileMaritalStatus = $scope.selectData.findByValue('maritalStatus', $scope.profileDetails.accountHolders[0].maritalStatus);
                            $scope.firstApplicant.profileNumDependents = $scope.profileDetails.accountHolders[0].numDependents;
                            
                            $scope.firstApplicant.profilePhoneNumberType = $scope.selectData.findByValue('phoneNumberType', $scope.profileDetails.accountHolders[0].phoneNumbers[0].phoneNumberType);
                            $scope.firstApplicant.profilePhoneNumber = parseInt($scope.profileDetails.accountHolders[0].phoneNumbers[0].phoneNumber);
                            $scope.firstApplicant.profileEmploymentStatus = $scope.selectData.findByValue('employmentStatus', $scope.profileDetails.accountHolders[0].employmentStatus);
                            if ($scope.firstApplicant.profileEmploymentStatus.value == "EMPLOYED") {
                                $scope.firstApplicant.profileEmploymentPosition = $scope.profileDetails.accountHolders[0].positionEmployed;
                                $scope.firstApplicant.profileEmployerName = $scope.profileDetails.accountHolders[0].employer;
                                $scope.firstApplicant.profileEmploymentYear = $scope.profileDetails.accountHolders[0].yearsEmployed;
                                if ($scope.profileDetails.accountHolders[0].businessAddress[0]) {
                                    $scope.firstApplicant.profileEmploymentCountry = $scope.selectData.findByValue('countries', $scope.profileDetails.accountHolders[0].businessAddress[0].country);
                                    $scope.firstApplicant.profileEmploymentCity = $scope.profileDetails.accountHolders[0].businessAddress[0].city;
                                    $scope.firstApplicant.profileEmploymentState = $scope.selectData.findByValue('states', $scope.profileDetails.accountHolders[0].businessAddress[0].state);
                                    $scope.firstApplicant.profileEmploymentPostal = $scope.profileDetails.accountHolders[0].businessAddress[0].postalCode;
                                    $scope.firstApplicant.profileEmploymentAddressLine = $scope.profileDetails.accountHolders[0].businessAddress[0].streetAddress[0];
                                }
                            }

                            if ($scope.profileDetails.accountHolders[1]) {
                                $scope.secondApplicant.firstName = $scope.profileDetails.accountHolders[1].givenName;
                                $scope.secondApplicant.lastName = $scope.profileDetails.accountHolders[1].familyName;
                                $scope.secondApplicant.homeAddressCountry = $scope.selectData.findByValue('countries', $scope.profileDetails.accountHolders[1].homeAddress[0].country);
                                $scope.secondApplicant.homeAddressCity = $scope.profileDetails.accountHolders[1].homeAddress[0].city;
                                $scope.secondApplicant.homeAddressState = $scope.selectData.findByValue('states', $scope.profileDetails.accountHolders[1].homeAddress[0].state);
                                $scope.secondApplicant.homeAddressPostal = $scope.profileDetails.accountHolders[1].homeAddress[0].postalCode;
                                $scope.secondApplicant.homeAddressLine = $scope.profileDetails.accountHolders[1].homeAddress[0].streetAddress[0];

                                $scope.secondApplicant.profileMaritalStatus = $scope.selectData.findByValue('maritalStatus', $scope.profileDetails.accountHolders[1].maritalStatus);
                                $scope.secondApplicant.profileNumDependents = $scope.profileDetails.accountHolders[1].numDependents;
                                $scope.secondApplicant.profilePhoneNumberType = $scope.selectData.findByValue('phoneNumberType', $scope.profileDetails.accountHolders[1].phoneNumbers[0].phoneNumberType);
                                $scope.secondApplicant.profilePhoneNumber = parseInt($scope.profileDetails.accountHolders[1].phoneNumbers[0].phoneNumber);
                                $scope.secondApplicant.profileEmploymentStatus = $scope.selectData.findByValue('employmentStatus', $scope.profileDetails.accountHolders[1].employmentStatus);
                                if ($scope.secondApplicant.profileEmploymentStatus.value == "EMPLOYED") {
                                    $scope.secondApplicant.profileEmploymentPosition = $scope.profileDetails.accountHolders[1].positionEmployed;
                                    $scope.secondApplicant.profileEmployerName = $scope.profileDetails.accountHolders[1].employer;
                                    $scope.secondApplicant.profileEmploymentYear = $scope.profileDetails.accountHolders[1].yearsEmployed;
                                    if ($scope.profileDetails.accountHolders[1].businessAddress) {
                                        $scope.secondApplicant.profileEmploymentCountry = $scope.selectData.findByValue('countries', $scope.profileDetails.accountHolders[1].businessAddress[0].country);
                                        $scope.secondApplicant.profileEmploymentCity = $scope.profileDetails.accountHolders[1].businessAddress[0].city;
                                        $scope.secondApplicant.profileEmploymentState = $scope.selectData.findByValue('states', $scope.profileDetails.accountHolders[1].businessAddress[0].state);
                                        $scope.secondApplicant.profileEmploymentPostal = $scope.profileDetails.accountHolders[1].businessAddress[0].postalCode;
                                        $scope.secondApplicant.profileEmploymentAddressLine = $scope.profileDetails.accountHolders[1].businessAddress[0].streetAddress[0];
                                    }
                                }
                            }
                        } else if (tableId == 1) {
                            $scope.annualIncomeUSD = $scope.selectData.findByValue('annualIncome', $scope.profileDetails.annualIncomeUSD);
                            $scope.federalTaxBracketPercent = $scope.profileDetails.federalTaxBracketPercent;
                            $scope.investmentExperience = $scope.selectData.findByValue('investmentExperience', $scope.profileDetails.investmentExperience);
                            $scope.investmentObjective = $scope.selectData.findByValue('investmentObjective', $scope.profileDetails.investmentObjective);
                            $scope.liquidNetWorthUSD = $scope.selectData.findByValue('netWorth', $scope.profileDetails.liquidNetWorthUSD);
                            $scope.liquidityNeeds = $scope.selectData.findByValue('liquidityNeeds', $scope.profileDetails.liquidityNeeds);
                            $scope.riskTolerance = $scope.selectData.findByValue('riskTolerance', $scope.profileDetails.riskTolerance);
                            $scope.timeHorizon = $scope.selectData.findByValue('timeHorizon', $scope.profileDetails.timeHorizon);
                            $scope.totalNetWorthUSD = $scope.selectData.findByValue('netWorth', $scope.profileDetails.totalNetWorthUSD);

                        }
                    });
                });
                
            }
            $('html, body').animate({
                scrollTop: 0
            }, 500);
        }

        $scope.activeProfileTableNav = function(tableId) {

            deselectAll();
            $scope.activeWorkspaces[tableId].active = true;
            var tableElement = angular.element(document.querySelector("#" + $scope.activeWorkspaces[tableId].name));
            tableElement.addClass("account-active-tab");
            sessionStorage.setItem("profileTableId", tableId);

            

        };

        $scope.postPersonalInfo = function() {
            // checkAuthenticate();

            AccountService.asAuthenticated(function() {
                var jsonRequest = {};

                jsonRequest.applicants = [];
                jsonRequest.applicants[0] = {};
                if ($scope.firstApplicant.profileMaritalStatus) {
                    jsonRequest.applicants[0].maritalStatus = $scope.firstApplicant.profileMaritalStatus.value;
                }
                jsonRequest.applicants[0].numDependents = $scope.firstApplicant.profileNumDependents;

                jsonRequest.applicants[0].givenName = $scope.firstApplicant.firstName;
                jsonRequest.applicants[0].familyName = $scope.firstApplicant.lastName;
                jsonRequest.applicants[0].homeAddress = [];
                jsonRequest.applicants[0].homeAddress[0] = {};
                if ($scope.firstApplicant.homeAddressCountry) {
                    jsonRequest.applicants[0].homeAddress[0].country = $scope.firstApplicant.homeAddressCountry.value;
                }
                if ($scope.firstApplicant.homeAddressState) {
                    jsonRequest.applicants[0].homeAddress[0].state = $scope.firstApplicant.homeAddressState.value;
                }
                jsonRequest.applicants[0].homeAddress[0].city = $scope.firstApplicant.homeAddressCity;
                jsonRequest.applicants[0].homeAddress[0].postalCode = $scope.firstApplicant.homeAddressPostal;
                jsonRequest.applicants[0].homeAddress[0].streetAddress = [];
                jsonRequest.applicants[0].homeAddress[0].streetAddress[0] = $scope.firstApplicant.homeAddressLine;
                
                jsonRequest.applicants[0].phoneNumbers = [];
                jsonRequest.applicants[0].phoneNumbers[0] = {};
                if ($scope.firstApplicant.profilePhoneNumberType) {
                    jsonRequest.applicants[0].phoneNumbers[0].phoneNumberType = $scope.firstApplicant.profilePhoneNumberType.value;
                }
                jsonRequest.applicants[0].phoneNumbers[0].phoneNumber = $scope.firstApplicant.profilePhoneNumber;
                if ($scope.firstApplicant.profileEmploymentStatus) {
                    jsonRequest.applicants[0].employmentStatus = $scope.firstApplicant.profileEmploymentStatus.value;
                }

                if ($scope.firstApplicant.profileEmploymentStatus.value = "EMPLOYED") {
                    jsonRequest.applicants[0].businessAddress = [];
                    jsonRequest.applicants[0].businessAddress[0] = {};
                    jsonRequest.applicants[0].businessAddress[0].postalCode = $scope.firstApplicant.profileEmploymentPostal;
                    if ($scope.firstApplicant.profileEmploymentCountry) {
                        jsonRequest.applicants[0].businessAddress[0].country = $scope.firstApplicant.profileEmploymentCountry.value;
                    }
                    jsonRequest.applicants[0].businessAddress[0].streetAddress = [];
                    jsonRequest.applicants[0].businessAddress[0].streetAddress[0] = $scope.firstApplicant.profileEmploymentAddressLine;
                    jsonRequest.applicants[0].businessAddress[0].city = $scope.firstApplicant.profileEmploymentCity;
                    if ($scope.firstApplicant.profileEmploymentState) {
                        jsonRequest.applicants[0].businessAddress[0].state = $scope.firstApplicant.profileEmploymentState.value;
                    }
                }

                if ($scope.profileDetails.accountHolders.length == 2) {
                    jsonRequest.applicants[1] = {};
                    if ($scope.secondApplicant.profileMaritalStatus) {
                        jsonRequest.applicants[1].maritalStatus = $scope.secondApplicant.profileMaritalStatus.value;
                    }
                    jsonRequest.applicants[1].numDependents = $scope.secondApplicant.profileNumDependents;

                    jsonRequest.applicants[1].givenName = $scope.secondApplicant.firstName;
                    jsonRequest.applicants[1].familyName = $scope.secondApplicant.lastName;
                    jsonRequest.applicants[1].homeAddress = [];
                    jsonRequest.applicants[1].homeAddress[0] = {};
                    if ($scope.secondApplicant.homeAddressCountry) {
                        jsonRequest.applicants[1].homeAddress[0].country = $scope.secondApplicant.homeAddressCountry.value;
                    }
                    if ($scope.secondApplicant.homeAddressState) {
                        jsonRequest.applicants[1].homeAddress[0].state = $scope.secondApplicant.homeAddressState.value;
                    }
                    jsonRequest.applicants[1].homeAddress[0].city = $scope.secondApplicant.homeAddressCity;
                    jsonRequest.applicants[1].homeAddress[0].postalCode = $scope.secondApplicant.homeAddressPostal;
                    jsonRequest.applicants[1].homeAddress[0].streetAddress = [];
                    jsonRequest.applicants[1].homeAddress[0].streetAddress[0] = $scope.secondApplicant.homeAddressLine;

                    jsonRequest.applicants[1].phoneNumbers = [];
                    jsonRequest.applicants[1].phoneNumbers[0] = {};
                    if ($scope.secondApplicant.profilePhoneNumberType) {
                        jsonRequest.applicants[1].phoneNumbers[0].phoneNumberType = $scope.secondApplicant.profilePhoneNumberType.value;
                    }
                    jsonRequest.applicants[1].phoneNumbers[0].phoneNumber = $scope.secondApplicant.profilePhoneNumber;
                    if ($scope.secondApplicant.profileEmploymentStatus) {
                        jsonRequest.applicants[1].employmentStatus = $scope.secondApplicant.profileEmploymentStatus.value;
                    }

                    if ($scope.secondApplicant.profileEmploymentStatus.value = "EMPLOYED") {
                        jsonRequest.applicants[1].businessAddress = [];
                        jsonRequest.applicants[1].businessAddress[0] = {};
                        jsonRequest.applicants[1].businessAddress[0].postalCode = $scope.secondApplicant.profileEmploymentPostal;
                        if ($scope.secondApplicant.profileEmploymentCountry) {
                            jsonRequest.applicants[1].businessAddress[0].country = $scope.secondApplicant.profileEmploymentCountry.value;
                        }
                        jsonRequest.applicants[1].businessAddress[0].streetAddress = [];
                        jsonRequest.applicants[1].businessAddress[0].streetAddress[0] = {};
                        jsonRequest.applicants[1].businessAddress[0].streetAddress[0] = $scope.secondApplicant.profileEmploymentAddressLine;
                        jsonRequest.applicants[1].businessAddress[0].city = $scope.secondApplicant.profileEmploymentCity;
                        if ($scope.secondApplicant.profileEmploymentState) {
                            jsonRequest.applicants[1].businessAddress[0].state = $scope.secondApplicant.profileEmploymentState.value;
                        }
                    }
                }
                    

                ProfileService.patchUpdate(user_id, jsonRequest)
                .then(function(response) {
                    console.log("patchPersonInfo", response);
                });
            });
            
        };

        $scope.postInvestPreference = function() {

            AccountService.asAuthenticated(function() {
                var jsonRequest = {};

                if ($scope.annualIncomeUSD) {
                    jsonRequest.annualIncomeUSD = $scope.annualIncomeUSD.value;
                }

                jsonRequest.federalTaxBracketPercent = $scope.federalTaxBracketPercent;

                if ($scope.investmentExperience) {
                    jsonRequest.investmentExperience = $scope.investmentExperience.value;
                }
                if ($scope.investmentObjective) {
                    jsonRequest.investmentObjective = $scope.investmentObjective.value;
                }
                if ($scope.liquidNetWorthUSD) {
                    jsonRequest.liquidNetWorthUSD = $scope.liquidNetWorthUSD.value;
                }
                if ($scope.liquidityNeeds) {
                    jsonRequest.liquidityNeeds = $scope.liquidityNeeds.value;
                }
                if ($scope.riskTolerance) {
                    jsonRequest.riskTolerance = $scope.riskTolerance.value;
                }
                if ($scope.timeHorizon) {
                    jsonRequest.timeHorizon = $scope.timeHorizon.value;
                }
                if ($scope.totalNetWorthUSD) {
                    jsonRequest.totalNetWorthUSD = $scope.totalNetWorthUSD.value;
                }

                ProfileService.patchUpdate(user_id, jsonRequest)
                .then(function(response) {
                    console.log("patchInvestmentPreferences", response);
                });
            });
            
        }

        $scope.init();
    };

    

    m.controller('ProfileController', [
        'AccountService',
        '$location',
        '$rootScope',
        '$routeParams',
        '$scope',
        'LoginService',
        'TextService',
        'GetCurrentUserService',
        'ProfileService',
        'SelectDataService',
        profileControllerFunction
    ]);
})();
