(function () {
    'use strict';

    var m = angular.module('OpenAccountCtrl', []);

    var openAccountControllerFunction = function ($base64, $cookies, $filter, $location, $rootScope, $scope, $window, $route, OpenAccountService, SelectDataService, TextService) {

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        $scope.financialNames = {
            "annualIncome": "Annual Household Income Range",
            "netWorth": "Total Net Worth Range",
            "liquidWorth": "Liquid Net Worth Range",
            "riskTolerance": "Risk Tolerance",
            "investmentExperience": "Investment Experience",
            "investmentObjective": "Investment Objective",
            "liquidityNeeds": "Liquidity Needs",
            "timeHorizon": "Time Horizon"
        };

        $scope.agreementPartNumber = 0;

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        $scope.workspaces =
            [
                {id: 0, name: "step_0", active: false},
                {id: 1, name: "step_1", active: false},
                {id: 2, name: "step_2", active: false},
                {id: 3, name: "step_3", active: false},
                {id: 4, name: "step_4", active: false},
                {id: 5, name: "step_5", active: false},
                {id: 6, name: "step_6", active: false},
                {id: 7, name: "step_7", active: false},
                {id: 8, name: "step_8", active: false},
                {id: 9, name: "step_9", active: false},
                {id: 10, name: "step_10", active: false}
            ];

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        $scope.financialValues = [];
        $scope.firstApplicant = [];
        $scope.secondApplicant = [];

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        $scope.setAllInactive = function () {
            angular.forEach($scope.workspaces, function (workspace) {
                workspace.active = false;
            });
        };

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        $scope.scrollTo = function () {
            $('html, body').animate({
                scrollTop: 0
            }, 500);
        };

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        var collapseToValue = function (targetObject, targetProperty) {
            if (targetObject && targetObject[targetProperty] && targetObject[targetProperty].value) {
                targetObject[targetProperty] = targetObject[targetProperty].value;
            }
        };

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        var prepareForSubmission = function (localSession) {
            var newLocalSession = angular.fromJson(angular.toJson(localSession));

            collapseToValue(newLocalSession.accountApplication, 'annualIncomeUSD');
            collapseToValue(newLocalSession.accountApplication, 'communityPropertyState');
            collapseToValue(newLocalSession.accountApplication, 'investmentExperience');
            collapseToValue(newLocalSession.accountApplication, 'investmentObjective');
            collapseToValue(newLocalSession.accountApplication, 'jointCustomerDisposition');
            collapseToValue(newLocalSession.accountApplication, 'liquidityNeeds');
            collapseToValue(newLocalSession.accountApplication, 'liquidNetWorthUSD');
            collapseToValue(newLocalSession.accountApplication, 'riskTolerance');
            collapseToValue(newLocalSession.accountApplication, 'timeHorizon');
            collapseToValue(newLocalSession.accountApplication, 'totalNetWorthUSD');

            console.log('Presubmission', newLocalSession);
            angular.forEach(newLocalSession.accountApplication.applicants, function (applicant, i) {
                collapseToValue(applicant, 'citizenshipCountry');
                collapseToValue(applicant, 'employmentStatus');
                collapseToValue(applicant, 'maritalStatus');

                collapseToValue(applicant.businessAddress, 'country');
                collapseToValue(applicant.businessAddress, 'state');

                collapseToValue(applicant.homeAddress, 'country');
                collapseToValue(applicant.homeAddress, 'state');

                collapseToValue(applicant.mailingAddress, 'country');
                collapseToValue(applicant.mailingAddress, 'state');

                collapseToValue(applicant.phoneNumbers[0], 'phoneNumberType');

                if (!applicant.maritalStatus) delete applicant.maritalStatus;
                if (!applicant.numDependents) delete applicant.numDependents;

                if (i === 1 && !newLocalSession.accountApplication.applicants[1].emailAddresses[0]) {
                    delete newLocalSession.accountApplication.applicants[1].emailAddresses;
                }

                if (i === 0 && $scope.firstApplicant.mailAddressSetting) delete newLocalSession.accountApplication.applicants[0].mailingAddress;
                if (i === 1 && $scope.secondApplicant.mailAddressSetting) delete newLocalSession.accountApplication.applicants[1].mailingAddress;
            });

            if (newLocalSession.accountApplication.customerType != 'JOINT') {
                delete newLocalSession.accountApplication.jointCustomerDisposition;
                delete newLocalSession.accountApplication.communityPropertyState;
                delete newLocalSession.accountApplication.jointTenantsInCommonParticipants;
                if (newLocalSession.accountApplication.applicants.length > 1)
                {
                    newLocalSession.accountApplication.applicants = newLocalSession.accountApplication.applicants.shift();
                }
            }

            return newLocalSession;
        };

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        var saveWorkspaceForApplicant = function (step_id, localSession, n) {
            var beforeSaveWIP;

            var sourceProperty = (n === 0 ? $scope.firstApplicant : $scope.secondApplicant);

            while (localSession.accountApplication.applicants.length <= n) {
                localSession.accountApplication.applicants.push({})
            }

            if (step_id === 3 || step_id === 6) {
                if (sourceProperty.maritalStatus) {
                    localSession.accountApplication.applicants[n].maritalStatus = sourceProperty.maritalStatus;
                } else {
                    delete localSession.accountApplication.applicants[n].maritalStatus;
                }

                if (sourceProperty.numDependents) {
                    localSession.accountApplication.applicants[n].numDependents = sourceProperty.numDependents;
                } else {
                    delete localSession.accountApplication.applicants[n].numDependents;
                }

                localSession.accountApplication.applicants[n].givenName = sourceProperty.firstName;
                localSession.accountApplication.applicants[n].familyName = sourceProperty.lastName;
                localSession.accountApplication.applicants[n].dateOfBirth = $filter('date')(new Date(sourceProperty.dateOfBirth), 'MM/dd/yyyy');
                localSession.accountApplication.applicants[n].citizenshipCountry = sourceProperty.citizenshipCountry;
                localSession.accountApplication.applicants[n].socialSecurityNumber = sourceProperty.socialSecurityNumber;

                localSession.accountApplication.applicants[n].homeAddress = {
                    streetAddress: [
                        sourceProperty.addressline
                    ],
                    city: sourceProperty.city,
                    state: sourceProperty.state,
                    postalCode: sourceProperty.postalCode,
                    country: sourceProperty.citizenshipCountry
                };

                if (sourceProperty.mailAddressSetting == false) {
                    localSession.accountApplication.applicants[n].mailingAddress = {
                        streetAddress: [
                            sourceProperty.mailAddressline
                        ],
                        city: sourceProperty.mailCity,
                        state: sourceProperty.mailState,
                        postalCode: sourceProperty.mailPostalCode,
                        country: sourceProperty.mailCountry
                    };
                } else {
                    localSession.accountApplication.applicants[n].mailingAddress = {
                        streetAddress: [
                            sourceProperty.addressline
                        ],
                        city: sourceProperty.city,
                        state: sourceProperty.state,
                        postalCode: sourceProperty.postalCode,
                        country: sourceProperty.citizenshipCountry
                    };
                }

                localSession.accountApplication.applicants[n].phoneNumbers = [
                    {
                        phoneNumberType: sourceProperty.phoneNumberType,
                        phoneNumber: sourceProperty.phoneNumber
                    }
                ];

                localSession.accountApplication.applicants[n].emailAddresses = [
                    sourceProperty.email
                ];

            } else if (step_id === 4 || step_id === 7) {

                localSession.accountApplication.applicants[n].isAffiliatedExchangeOrFINRA = sourceProperty.affiliatedFINRA;
                if (sourceProperty.affiliatedFINRA == "YES") {
                    localSession.accountApplication.applicants[n].firmName = sourceProperty.firmName;
                    localSession.accountApplication.applicants[n].affiliatedApproval = [];

                    beforeSaveWIP = function (continueSaveWIP) {
                        var base64_encoded_data = $base64.encode(sourceProperty.Letter);

                        var uploadFileJSON = {
                            fileName: sourceProperty.Letter.name,
                            resourceType: (step_id === 4 ? "document.407_letter.1" : "document.407_letter.2"),
                            contentType: sourceProperty.Letter.type,
                            data: base64_encoded_data
                        };

                        OpenAccountService.uploadFile(sessionStorage.getItem("WIPItemID"), uploadFileJSON)
                            .then(function (response) {
                                    console.log("uploadFile Response", response);

                                    if (response.status && response.status.statusCode === "OK") {
                                        localSession.accountApplication.applicants[n].affiliatedApproval[0] = response.response.binaryResourceId;

                                        if (continueSaveWIP) continueSaveWIP();

                                    } else {
                                        console.log("uploadFile Response Not OK.");

                                        // always continue if going back
                                        if (to_step_id < from_step_id && afterSaveWIP) afterSaveWIP();
                                    }
                                },
                                function (response) {
                                    console.log("uploadFile Failed", response);

                                    // always continue if going back
                                    if (to_step_id < from_step_id && afterSaveWIP) afterSaveWIP();
                                });
                    };
                } else {
                    delete localSession.accountApplication.applicants[n].firmName;
                    delete localSession.accountApplication.applicants[n].affiliatedApproval;
                }

                localSession.accountApplication.applicants[n].isControlPerson = sourceProperty.isControlPerson;
                if (sourceProperty.isControlPerson == "YES") {
                    if (sourceProperty.companySymbols && sourceProperty.companySymbols.length > 0) {
                        localSession.accountApplication.applicants[n].companySymbols = sourceProperty.companySymbols.split('\n');
                    } else {
                        localSession.accountApplication.applicants[n].companySymbols = [];
                    }
                } else {
                    delete localSession.accountApplication.applicants[n].companySymbols;
                }

                localSession.accountApplication.applicants[n].isPoliticallyExposed = sourceProperty.isPoliticallyExposed;
                if (sourceProperty.isPoliticallyExposed == "YES") {
                    if (sourceProperty.immediateFamily && sourceProperty.immediateFamily.length > 0) {
                        localSession.accountApplication.applicants[n].immediateFamily = sourceProperty.immediateFamily.split('\n');
                    } else {
                        localSession.accountApplication.applicants[n].immediateFamily = [];
                    }
                    localSession.accountApplication.applicants[n].politicalOrganization = sourceProperty.politicalOrganization;
                } else {
                    delete localSession.accountApplication.applicants[n].immediateFamily;
                    delete localSession.accountApplication.applicants[n].politicalOrganization;
                }

            } else if (step_id === 5 || step_id === 8) {

                localSession.accountApplication.applicants[n].employmentStatus = sourceProperty.employmentStatus;
                if (sourceProperty.employmentStatus.value == "EMPLOYED") {
                    localSession.accountApplication.applicants[n].positionEmployed = sourceProperty.postionEmployed;
                    localSession.accountApplication.applicants[n].employer = sourceProperty.employer;

                    if (sourceProperty.yearsEmployed) {
                        localSession.accountApplication.applicants[n].yearsEmployed = sourceProperty.yearsEmployed;
                    } else {
                        delete localSession.accountApplication.applicants[n].yearsEmployed;
                    }

                    var needBusinessAddress = false;
                    needBusinessAddress = needBusinessAddress || sourceProperty.businessAddressline;
                    needBusinessAddress = needBusinessAddress || sourceProperty.businessCity;
                    needBusinessAddress = needBusinessAddress || sourceProperty.businessState;
                    needBusinessAddress = needBusinessAddress || sourceProperty.businessPostal;
                    needBusinessAddress = needBusinessAddress || sourceProperty.businessCountry;

                    if (needBusinessAddress) {
                        localSession.accountApplication.applicants[n].businessAddress = {
                            city: sourceProperty.businessCity,
                            postalCode: sourceProperty.businessPostal,
                            country: sourceProperty.businessCountry,
                            state: sourceProperty.businessState,
                            streetAddress: [sourceProperty.businessAddressline]
                        };
                    } else {
                        delete localSession.accountApplication.applicants[n].businessAddress;
                    }

                } else {
                    delete localSession.accountApplication.applicants[n].employer;
                    delete localSession.accountApplication.applicants[n].positionEmployed;
                    delete localSession.accountApplication.applicants[n].businessAddress;
                    delete localSession.accountApplication.applicants[n].yearsEmployed;
                }
            }

            if (beforeSaveWIP) return beforeSaveWIP;
        };

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        var saveWorkspace = function (from_step_id, to_step_id, afterSaveWIP) {
            var beforeSaveWIP;

            var localSession = sessionStorage.getItem("localSession");
            if (localSession)
                localSession = angular.fromJson(localSession);

            switch (from_step_id) {

                case 0: ////////////////////

                    localSession.accountApplication.applicants[0].givenName = $scope.firstApplicant.firstName;
                    localSession.accountApplication.applicants[0].familyName = $scope.firstApplicant.lastName;
                    localSession.accountApplication.applicants[0].citizenshipCountry = $scope.firstApplicant.citizenshipCountry;
                    localSession.accountApplication.applicants[0].emailAddresses = [$scope.firstApplicant.email];
                    localSession.accountApplication.applicants[0].dateOfBirth = $filter('date')($scope.firstApplicant.dateOfBirth, 'MM/dd/yyyy');

                    break;

                case 1: ////////////////////

                    localSession.accountApplication.federalTaxBracketPercent = $scope.financialValues.taxBracket;

                    localSession.accountApplication.annualIncomeUSD = $scope.financialValues.annualIncome;
                    localSession.accountApplication.investmentExperience = $scope.financialValues.investmentExperience;
                    localSession.accountApplication.investmentObjective = $scope.financialValues.investmentObjective;
                    localSession.accountApplication.liquidityNeeds = $scope.financialValues.liquidityNeeds;
                    localSession.accountApplication.liquidNetWorthUSD = $scope.financialValues.liquidWorth;
                    localSession.accountApplication.riskTolerance = $scope.financialValues.riskTolerance;
                    localSession.accountApplication.timeHorizon = $scope.financialValues.timeHorizon;
                    localSession.accountApplication.totalNetWorthUSD = $scope.financialValues.netWorth;

                    break;

                case 2: ////////////////////

                    sessionStorage.setItem("customerType", $scope.customerType);
                    localSession.accountApplication.customerType = $scope.customerType;
                    break;

                case 3: ////////////////////

                    sessionStorage.setItem("firstUserMailAddressSetting", $scope.firstApplicant.mailAddressSetting);
                    saveWorkspaceForApplicant(from_step_id, localSession, 0);
                    break;

                case 4: ////////////////////

                    beforeSaveWIP = saveWorkspaceForApplicant(from_step_id, localSession, 0);
                    break;

                case 5: ////////////////////

                    saveWorkspaceForApplicant(from_step_id, localSession, 0);

                    if (localSession.accountApplication.customerType == "INDIVIDUAL") {
                        beforeSaveWIP = function (continueSaveWIP) {
                            var localSessionConverted = prepareForSubmission(localSession);

                            OpenAccountService.getAgreement(sessionStorage.getItem("WIPItemID"), localSessionConverted)
                                .then(function (response) {
                                        console.log('getAgreement Response', response);

                                        if (response.status && response.status.statusCode == "OK") {
                                            sessionStorage.setItem("agreementParts", angular.toJson(response.response.agreementParts));
                                            if (continueSaveWIP) continueSaveWIP();

                                        } else {
                                            console.log('getAgreement Not OK.');
                                            angular.forEach(response.status.statusDetails.validationErrors, function(validationError) {
                                                TextService.popup('validation_error', {data: [validationError.error]});
                                            });
                                            // always continue if going back
                                            if (to_step_id < from_step_id && afterSaveWIP) afterSaveWIP();
                                        }
                                    },
                                    function (response) {
                                        console.log("getAgreement Failed", response);

                                        // always continue if going back
                                        if (to_step_id < from_step_id && afterSaveWIP) afterSaveWIP();
                                    });
                        };
                    }
                    

                    break;

                case 6: ////////////////////

                    sessionStorage.setItem("secondUserMailAddressSetting", $scope.secondApplicant.mailAddressSetting);

                    saveWorkspaceForApplicant(from_step_id, localSession, 1);
                    break;

                case 7: ////////////////////

                    beforeSaveWIP = saveWorkspaceForApplicant(from_step_id, localSession, 1);
                    break;

                case 8: ////////////////////

                    saveWorkspaceForApplicant(from_step_id, localSession, 1);
                    break;

                case 9: ////////////////////

                    if (localSession.accountApplication.customerType == "JOINT") {
                        localSession.accountApplication.jointCustomerDisposition = $scope.firstApplicant.jointCustomerDisposition;

                        if ($scope.firstApplicant.jointCustomerDisposition) {
                            if ($scope.firstApplicant.jointCustomerDisposition.value == "COMMUNITY_PROPERTY") {
                                localSession.accountApplication.communityPropertyState = $scope.firstApplicant.communityPropertyState;

                            } else if ($scope.firstApplicant.jointCustomerDisposition.value == "TENANTS_IN_COMMON") {

                                localSession.accountApplication.jointTenantsInCommonParticipants = [
                                    {
                                        name: $scope.firstApplicant.tenantsName,
                                        estatePercent: $scope.firstApplicant.estate
                                    },
                                    {
                                        name: $scope.secondApplicant.tenantsName,
                                        estatePercent: $scope.secondApplicant.estate
                                    }
                                ];
                            }
                        }
                    }

                    beforeSaveWIP = function (continueSaveWIP) {
                        var localSessionConverted = prepareForSubmission(localSession);

                        OpenAccountService.getAgreement(sessionStorage.getItem("WIPItemID"), localSessionConverted)
                            .then(function (response) {
                                    console.log('getAgreement Response', response);

                                    if (response.status && response.status.statusCode == "OK") {
                                        sessionStorage.setItem("agreementParts", angular.toJson(response.response.agreementParts));

                                        if (continueSaveWIP) continueSaveWIP();

                                    } else {
                                        console.log('getAgreement Not OK.');

                                        angular.forEach(response.status.statusDetails.validationErrors, function(validationError) {
                                            TextService.popup('validation_error', {data: [validationError.error]});
                                        });

                                        // always continue if going back
                                        if (to_step_id < from_step_id && afterSaveWIP) afterSaveWIP();
                                    }
                                },
                                function (response) {
                                    console.log("getAgreement Failed", response);

                                    // always continue if going back
                                    if (to_step_id < from_step_id && afterSaveWIP) afterSaveWIP();
                                });
                    };

                    break;
            }

            //////////////////////////////////////////////////
            var processWipResponse = function (response) {
                console.log("WIP POST/PUT Response", response);

                if (response.status && response.status.statusCode == "OK") {
                    sessionStorage.setItem("WIPItemID", response.response.workInProgressItemId);

                    // second save...after the promises, in case they modify the localSession (e.g. affiliatedApproval GUIDs)
                    sessionStorage.setItem("localSession", angular.toJson(localSession));

                    // finally, call the "after" hook if it was provided.
                    if (afterSaveWIP) afterSaveWIP();

                } else {
                    console.log("WIP POST/PUT Not OK.");

                    // always continue if going back
                    if (to_step_id < from_step_id && afterSaveWIP) afterSaveWIP();
                }
            };

            //////////////////////////////////////////////////
            var processWipError = function (response) {
                console.log('WIP POST/PUT Failed', response);



                // always continue if going back
                if (to_step_id < from_step_id && afterSaveWIP) afterSaveWIP();
            };

            // first save...before the promises
            sessionStorage.setItem("localSession", angular.toJson(localSession));

            // determine whether we're POSTing or PUTting to the WIP and assign to the function variable
            // as appropriate.

            var saveWIP;

            var wipItemId = sessionStorage.getItem("WIPItemID");
            if (wipItemId) {
                saveWIP = function () {
                    OpenAccountService.updateWIP(wipItemId, prepareForSubmission(localSession)).then(processWipResponse, processWipError);
                    
                }

            } else {
                saveWIP = function () {

                    OpenAccountService.postWIP(prepareForSubmission(localSession)).then(processWipResponse, processWipError);
                }
            }

            // if we have a "before" save hook, call it, passing the save function, which it will call
            // ...otherwise, just save it.

            if (beforeSaveWIP) {
                beforeSaveWIP(saveWIP);
            } else {
                saveWIP();
            }
        };

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        $scope.changeWorkspace = function (from_step_id, to_step_id) {
            saveWorkspace(from_step_id, to_step_id, function () {
                $scope.showWorkspace(to_step_id);
            });
        };

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        $scope.showWorkspace = function (id) {
            if ((id >= 6 && id <= 9) && (sessionStorage.getItem("customerType") == "INDIVIDUAL" || !sessionStorage.getItem("customerType"))) {
                $scope.showWorkspace(10);

            } else {
                // sessionStorage.setItem("step_id", id);
                // $location.path('open-account-' + (id + 1));

                var wipItemId = sessionStorage.getItem("WIPItemID");

                if (wipItemId) {
                    OpenAccountService.validateWIP(wipItemId)
                    .then(function(response) {
                        console.log('wipValidate Response', response);

                        if (response.status && response.status.statusCode == "OK") {
                            sessionStorage.setItem("step_id", id);
                            $location.path('open-account-' + (id + 1));
                        } else {
                            console.log('wipValidate Not OK.');

                            switch (id) {
                                case 2:
                                    var wip_error_flag = 0;
                                    angular.forEach(response.status.statusDetails.validationErrors, function(validationError) {
                                        if ((validationError.element == 'annualIncomeUSD') || 
                                            (validationError.element == 'federalTaxBracketPercent') || 
                                            (validationError.element == 'investmentExperience') || 
                                            (validationError.element == 'investmentObjective') || 
                                            (validationError.element == 'liquidityNeeds') || 
                                            (validationError.element == 'liquidNetWorthUSD') || 
                                            (validationError.element == 'riskTolerance') || 
                                            (validationError.element == 'timeHorizon') || 
                                            (validationError.element == 'totalNetWorthUSD')) {
                                            
                                            TextService.popup('validation_error', {data: [validationError.error]});
                                            wip_error_flag = 1;
                                        }
                                    });

                                    if (wip_error_flag == 0) {
                                        sessionStorage.setItem("step_id", id);
                                        $location.path('open-account-' + (id + 1));
                                    }
                                    break;
                                case 3:
                                    var wip_error_flag = 0;
                                    
                                    angular.forEach(response.status.statusDetails.validationErrors, function(validationError) {
                                        if ((validationError.element == 'customerType')) {

                                            TextService.popup('validation_error', {data: [validationError.error]});
                                            wip_error_flag = 1;
                                        }
                                    });
                                    if (wip_error_flag == 0) {
                                        sessionStorage.setItem("step_id", id);
                                        $location.path('open-account-' + (id + 1));
                                    }
                                    break;
                                case 4:
                                    var wip_error_flag = 0;
                                    
                                    angular.forEach(response.status.statusDetails.validationErrors, function(validationError) {
                                        if ((validationError.element == 'citizenshipCountry') || 
                                            (validationError.element == 'socialSecurityNumber') || 
                                            (validationError.element == 'homeAddress.postalCode') || 
                                            (validationError.element == 'homeAddress.city') || 
                                            (validationError.element == 'homeAddress.streetAddress') || 
                                            (validationError.element == 'homeAddress.state') || 
                                            (validationError.element == 'phoneNumber') || 
                                            (validationError.element == 'phoneNumberType') || 
                                            (validationError.element == 'mailAddress.postalCode') || 
                                            (validationError.element == 'mailAddress.streetAddress') || 
                                            (validationError.element == 'mailAddress.state') || 
                                            (validationError.element == 'mailAddress.country') || 
                                            (validationError.element == 'mailAddress.city')) {

                                            TextService.popup('validation_error', {data: [validationError.error]});
                                            wip_error_flag = 1;
                                        }
                                    });
                                    if (wip_error_flag == 0) {
                                        sessionStorage.setItem("step_id", id);
                                        $location.path('open-account-' + (id + 1));
                                    }
                                    break;
                                case 5:
                                    var wip_error_flag = 0;
                                    angular.forEach(response.status.statusDetails.validationErrors, function(validationError) {
                                        if ((validationError.element == 'isAffiliatedExchangeOrFINRA') || 
                                            (validationError.element == 'isControlPerson') || 
                                            (validationError.element == 'isPoliticallyExposed') || 
                                            (validationError.element == 'firmName') || 
                                            (validationError.element == 'affiliatedApproval') || 
                                            (validationError.element == 'companySymbols') || 
                                            (validationError.element == 'immediateFamily')) {
                                            
                                            TextService.popup('validation_error', {data: [validationError.error]});
                                            wip_error_flag = 1;
                                        }
                                    });

                                    if (wip_error_flag == 0) {
                                        sessionStorage.setItem("step_id", id);
                                        $location.path('open-account-' + (id + 1));
                                    }

                                    break;
                                case 6:
                                    var wip_error_flag = 0;
                                    angular.forEach(response.status.statusDetails.validationErrors, function(validationError) {
                                        if ((validationError.element == 'employmentStatus') || 
                                            (validationError.element == 'positionEmployed') || 
                                            (validationError.element == 'employer') || 
                                            (validationError.element == 'yearsEmployed') || 
                                            (validationError.element == 'businessAddress.postalCode') || 
                                            (validationError.element == 'businessAddress.country') || 
                                            (validationError.element == 'businessAddress.streetAddress') || 
                                            (validationError.element == 'businessAddress.city') || 
                                            (validationError.element == 'businessAddress.state')) {
                                            
                                            TextService.popup('validation_error', {data: [validationError.error]});
                                            wip_error_flag = 1;
                                        }
                                    });

                                    if (wip_error_flag == 0) {
                                        sessionStorage.setItem("step_id", id);
                                        $location.path('open-account-' + (id + 1));
                                    }

                                    break;
                                case 7:
                                    var wip_error_flag = 0;
                                    
                                    angular.forEach(response.status.statusDetails.validationErrors, function(validationError) {
                                        if ((validationError.element == 'citizenshipCountry') || 
                                            (validationError.element == 'socialSecurityNumber') || 
                                            (validationError.element == 'homeAddress.postalCode') || 
                                            (validationError.element == 'homeAddress.city') || 
                                            (validationError.element == 'homeAddress.streetAddress') || 
                                            (validationError.element == 'homeAddress.state') || 
                                            (validationError.element == 'phoneNumber') || 
                                            (validationError.element == 'phoneNumberType') || 
                                            (validationError.element == 'mailAddress.postalCode') || 
                                            (validationError.element == 'mailAddress.streetAddress') || 
                                            (validationError.element == 'mailAddress.state') || 
                                            (validationError.element == 'mailAddress.country') || 
                                            (validationError.element == 'mailAddress.city')) {

                                            TextService.popup('validation_error', {data: [validationError.error]});
                                            wip_error_flag = 1;
                                        }
                                    });
                                    if (wip_error_flag == 0) {
                                        sessionStorage.setItem("step_id", id);
                                        $location.path('open-account-' + (id + 1));
                                    }

                                    break;
                                case 8:
                                    var wip_error_flag = 0;
                                    angular.forEach(response.status.statusDetails.validationErrors, function(validationError) {
                                        if ((validationError.element == 'isAffiliatedExchangeOrFINRA') || 
                                            (validationError.element == 'isControlPerson') || 
                                            (validationError.element == 'isPoliticallyExposed') || 
                                            (validationError.element == 'firmName') || 
                                            (validationError.element == 'affiliatedApproval') || 
                                            (validationError.element == 'companySymbols') || 
                                            (validationError.element == 'immediateFamily')) {
                                            
                                            TextService.popup('validation_error', {data: [validationError.error]});
                                            wip_error_flag = 1;
                                        }
                                    });

                                    if (wip_error_flag == 0) {
                                        sessionStorage.setItem("step_id", id);
                                        $location.path('open-account-' + (id + 1));
                                    }

                                    break;
                                case 9:
                                    var wip_error_flag = 0;
                                    angular.forEach(response.status.statusDetails.validationErrors, function(validationError) {
                                        if ((validationError.element == 'employmentStatus') || 
                                            (validationError.element == 'positionEmployed') || 
                                            (validationError.element == 'employer') || 
                                            (validationError.element == 'yearsEmployed') || 
                                            (validationError.element == 'businessAddress.postalCode') || 
                                            (validationError.element == 'businessAddress.country') || 
                                            (validationError.element == 'businessAddress.streetAddress') || 
                                            (validationError.element == 'businessAddress.city') || 
                                            (validationError.element == 'businessAddress.state')) {
                                            
                                            TextService.popup('validation_error', {data: [validationError.error]});
                                            wip_error_flag = 1;
                                        }
                                    });

                                    if (wip_error_flag == 0) {
                                        sessionStorage.setItem("step_id", id);
                                        $location.path('open-account-' + (id + 1));
                                    }

                                    break;
                                case 10:
                                    var wip_error_flag = 0;
                                    angular.forEach(response.status.statusDetails.validationErrors, function(validationError) {
                                        if ((validationError.element == 'jointCustomerDisposition')) {
                                            
                                            TextService.popup('validation_error', {data: [validationError.error]});
                                            wip_error_flag = 1;
                                        }
                                    });

                                    if (wip_error_flag == 0) {
                                        sessionStorage.setItem("step_id", id);
                                        $location.path('open-account-' + (id + 1));
                                    }

                                    break;

                                default:
                                    sessionStorage.setItem("step_id", id);
                                    $location.path('open-account-' + (id + 1));
                                    break;

                                
                            }

                            // angular.forEach(response.status.statusDetails.validationErrors, function(validationError) {
                            //     TextService.popup('validation_error', {data: [validationError.error]});
                            // });
                        }
                    });
                } else {
                    sessionStorage.setItem("step_id", id);
                    $location.path('open-account-' + (id + 1));
                }
            }
        };

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        var setupInitialLocalSession = function () {
            var responseProduct = sessionStorage.getItem("responseProduct");
            if (responseProduct)
                responseProduct = angular.fromJson(responseProduct);

            var localSession = {
                riskProfile: {
                    riskScore: responseProduct.riskScore,
                    riskLevel: responseProduct.riskLevel,
                    riskLevelDescription: responseProduct.riskLevelDescription,
                    productAssignments: responseProduct.productAssignments,
                    questionAnswers: responseProduct.questionAnswers
                },
                accountApplication: {
                    annualIncomeUSD: $scope.selectData.findByValue('annualIncome', responseProduct.questionAnswers.annualIncomeUSD),
                    totalNetWorthUSD: $scope.selectData.findByValue('netWorth', responseProduct.questionAnswers.totalNetWorthUSD),
                    riskTolerance: $scope.selectData.findByValue('riskTolerance', responseProduct.riskLevelDescription),
                    investmentExperience: $scope.selectData.findByValue('investmentExperience', sessionStorage.getItem('investmentExperience')),
                    applicants: [
                        {
                            dateOfBirth: new Date(responseProduct.questionAnswers.dateOfBirth),
                            phoneNumbers: [
                                {
                                    // phoneNumberType: $scope.selectData['phoneNumberType'][0]
                                }
                            ],
                            citizenshipCountry: $scope.selectData.findByValue('countries', 'USA'),
                            homeAddress: {
                                state: $scope.selectData['states'][0],
                                country: $scope.selectData.findByValue('countries', 'USA')
                            }
                        }
                    ]
                }
            };

            sessionStorage.setItem('localSession', angular.toJson(localSession));

            console.log('initial localSession', localSession);

            return localSession;
        };

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        var loadWorkspacesForApplicant = function (localSession, n) {

            var targetProperty = (n === 0 ? $scope.firstApplicant : $scope.secondApplicant);

            //////////////////////////////
            // for steps 3 and 6

            if (localSession.accountApplication.applicants[n]) {
                if (localSession.accountApplication.applicants[n].maritalStatus) {
                    targetProperty.maritalStatus = localSession.accountApplication.applicants[n].maritalStatus;
                }

                if (localSession.accountApplication.applicants[n].numDependents) {
                    targetProperty.numDependents = localSession.accountApplication.applicants[n].numDependents;
                }

                if (localSession.accountApplication.applicants[n].givenName) {
                    targetProperty.firstName = localSession.accountApplication.applicants[n].givenName;
                }

                if (localSession.accountApplication.applicants[n].familyName) {
                    targetProperty.lastName = localSession.accountApplication.applicants[n].familyName;
                }

                if (localSession.accountApplication.applicants[n].emailAddresses) {
                    targetProperty.email = localSession.accountApplication.applicants[n].emailAddresses[0];
                }

                if (localSession.accountApplication.applicants[n].dateOfBirth) {
                    targetProperty.dateOfBirth = $filter('date')(new Date(localSession.accountApplication.applicants[n].dateOfBirth), 'MM/dd/yyyy');
                }

                if (localSession.accountApplication.applicants[n].citizenshipCountry) {
                    targetProperty.citizenshipCountry = localSession.accountApplication.applicants[n].citizenshipCountry;
                } else {
                    targetProperty.citizenshipCountry = $scope.selectData.findByValue('countries', 'USA');
                }

                if (localSession.accountApplication.applicants[n].socialSecurityNumber) {
                    targetProperty.socialSecurityNumber = localSession.accountApplication.applicants[n].socialSecurityNumber;
                }

                if (localSession.accountApplication.applicants[n].homeAddress) {
                    if (localSession.accountApplication.applicants[n].homeAddress.streetAddress) {
                        targetProperty.addressline = localSession.accountApplication.applicants[n].homeAddress.streetAddress[0];
                    }
                    targetProperty.city = localSession.accountApplication.applicants[n].homeAddress.city;
                    targetProperty.state = localSession.accountApplication.applicants[n].homeAddress.state;
                    targetProperty.postalCode = localSession.accountApplication.applicants[n].homeAddress.postalCode;
                    targetProperty.country = localSession.accountApplication.applicants[n].homeAddress.country;
                } else {
                    targetProperty.state = $scope.selectData['states'][0];
                    targetProperty.country = $scope.selectData.findByValue('countries', 'USA');
                }

                if (localSession.accountApplication.applicants[n].mailingAddress) {
                    if (localSession.accountApplication.applicants[n].mailingAddress.streetAddress) {
                        targetProperty.mailAddressline = localSession.accountApplication.applicants[n].mailingAddress.streetAddress[0];
                    }
                    targetProperty.mailCity = localSession.accountApplication.applicants[n].mailingAddress.city;
                    targetProperty.mailState = localSession.accountApplication.applicants[n].mailingAddress.state;
                    targetProperty.mailPostalCode = localSession.accountApplication.applicants[n].mailingAddress.postalCode;
                    targetProperty.mailCountry = localSession.accountApplication.applicants[n].mailingAddress.country;
                }

                if (localSession.accountApplication.applicants[n].phoneNumbers[0].phoneNumber) {
                    targetProperty.phoneNumberType = localSession.accountApplication.applicants[n].phoneNumbers[0].phoneNumberType;
                    targetProperty.phoneNumber = localSession.accountApplication.applicants[n].phoneNumbers[0].phoneNumber;
                } else if (angular.fromJson(sessionStorage.getItem("advisorInfo"))) {
                    targetProperty.phoneNumberType = $scope.selectData['phoneNumberType'][2];
                    targetProperty.phoneNumber = angular.fromJson(sessionStorage.getItem("advisorInfo")).advisorPhone;
                } else {
                    targetProperty.phoneNumberType = $scope.selectData['phoneNumberType'][0];
                }

            } else {
                targetProperty.citizenshipCountry = $scope.selectData.findByValue('countries', 'USA');
            }

            //////////////////////////////
            // for steps 4 and 7

            if (localSession.accountApplication.applicants[n].isAffiliatedExchangeOrFINRA) {
                targetProperty.affiliatedFINRA = localSession.accountApplication.applicants[n].isAffiliatedExchangeOrFINRA;
            }

            if (localSession.accountApplication.applicants[n].firmName) {
                targetProperty.firmName = localSession.accountApplication.applicants[n].firmName;
            }

            if (localSession.accountApplication.applicants[n].isControlPerson) {
                targetProperty.isControlPerson = localSession.accountApplication.applicants[n].isControlPerson;
            }

            if (localSession.accountApplication.applicants[n].companySymbols) {
                targetProperty.companySymbols = localSession.accountApplication.applicants[n].companySymbols.join('\n');
            }

            if (localSession.accountApplication.applicants[n].isPoliticallyExposed) {
                targetProperty.isPoliticallyExposed = localSession.accountApplication.applicants[n].isPoliticallyExposed;
            }

            if (localSession.accountApplication.applicants[n].politicalOrganization) {
                targetProperty.politicalOrganization = localSession.accountApplication.applicants[n].politicalOrganization;
            }

            if (localSession.accountApplication.applicants[n].immediateFamily) {
                targetProperty.immediateFamily = localSession.accountApplication.applicants[n].immediateFamily.join('\n');
            }

            //////////////////////////////
            // for steps 5 and 8

            if (localSession.accountApplication.applicants[n].employmentStatus) {
                targetProperty.employmentStatus = localSession.accountApplication.applicants[n].employmentStatus;
            }

            if (localSession.accountApplication.applicants[n].positionEmployed) {
                targetProperty.postionEmployed = localSession.accountApplication.applicants[n].positionEmployed;
            }

            if (localSession.accountApplication.applicants[n].employer) {
                targetProperty.employer = localSession.accountApplication.applicants[n].employer;
            }

            if (localSession.accountApplication.applicants[n].yearsEmployed) {
                targetProperty.yearsEmployed = localSession.accountApplication.applicants[n].yearsEmployed;
            }

            if (localSession.accountApplication.applicants[n].businessAddress) {
                if (localSession.accountApplication.applicants[n].mailingAddress.businessAddress) {
                    targetProperty.businessAddressline = localSession.accountApplication.applicants[n].businessAddress.streetAddress[0];
                }
                targetProperty.businessCity = localSession.accountApplication.applicants[n].businessAddress.city;
                targetProperty.businessState = localSession.accountApplication.applicants[n].businessAddress.state;
                targetProperty.businessPostal = localSession.accountApplication.applicants[n].businessAddress.postalCode;
                targetProperty.businessCountry = localSession.accountApplication.applicants[n].businessAddress.country;
            }
        };

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        var loadWorkspaces = function () {

            var localSession = sessionStorage.getItem("localSession");

            if (localSession) {
                localSession = angular.fromJson(localSession);
            }

            if (!localSession) {
                localSession = setupInitialLocalSession();
            }

            //////////////////////////////
            // for step 0

            if (localSession.accountApplication.applicants[0].givenName) {
                $scope.firstApplicant.firstName = localSession.accountApplication.applicants[0].givenName;
            } else if (angular.fromJson(sessionStorage.getItem("advisorInfo"))) {
                var nameArray = angular.fromJson(sessionStorage.getItem("advisorInfo")).advisorName.split(" ");
                $scope.firstApplicant.firstName = nameArray[0];
            }

            if (localSession.accountApplication.applicants[0].familyName) {
                $scope.firstApplicant.lastName = localSession.accountApplication.applicants[0].familyName;
            } else if (angular.fromJson(sessionStorage.getItem("advisorInfo"))) {
                var nameArray = angular.fromJson(sessionStorage.getItem("advisorInfo")).advisorName.split(" ");
                $scope.firstApplicant.lastName = nameArray[1];
            }

            if (localSession.accountApplication.applicants[0].emailAddresses) {
                $scope.firstApplicant.email = localSession.accountApplication.applicants[0].emailAddresses[0];
            } else if (angular.fromJson(sessionStorage.getItem("advisorInfo"))) {
                $scope.firstApplicant.email = angular.fromJson(sessionStorage.getItem("advisorInfo")).advisorEmail;
            }

            if (localSession.accountApplication.applicants[0].dateOfBirth) {
                $scope.firstApplicant.dateOfBirth = $filter('date')(new Date(localSession.accountApplication.applicants[0].dateOfBirth), 'MM/dd/yyyy');
            } else {
                console.log(2);
                $scope.firstApplicant.dateOfBirth = $filter('date')(new Date(angular.fromJson(sessionStorage.getItem("responseProduct")).questionAnswers.dateOfBirth), 'MM/dd/yyyy');
            }

            if (localSession.accountApplication.applicants[0].citizenshipCountry) {
                $scope.firstApplicant.citizenshipCountry = localSession.accountApplication.applicants[0].citizenshipCountry;
            } else {
                $scope.firstApplicant.citizenshipCountry = $scope.selectData.findByValue('countries', 'USA');
            }

            //////////////////////////////
            // for step 1

            if (localSession.accountApplication.federalTaxBracketPercent) {
                $scope.financialValues.taxBracket = localSession.accountApplication.federalTaxBracketPercent;
            }

            if (localSession.accountApplication.annualIncomeUSD) {
                $scope.financialValues.annualIncome = localSession.accountApplication.annualIncomeUSD;
            } else {
                $scope.financialValues.annualIncome = $scope.selectData.findByValue('annualIncome', angular.fromJson(sessionStorage.getItem("responseProduct")).questionAnswers.annualIncomeUSD);
            }

            if (localSession.accountApplication.totalNetWorthUSD) {
                $scope.financialValues.netWorth = localSession.accountApplication.totalNetWorthUSD
            } else {
                $scope.financialValues.netWorth = $scope.selectData.findByValue('netWorth', angular.fromJson(sessionStorage.getItem("responseProduct")).questionAnswers.totalNetWorthUSD);
            }

            if (localSession.accountApplication.liquidNetWorthUSD) {
                $scope.financialValues.liquidWorth = localSession.accountApplication.liquidNetWorthUSD;
            }

            if (localSession.accountApplication.riskTolerance) {
                $scope.financialValues.riskTolerance = localSession.accountApplication.riskTolerance;
            } else {
                $scope.financialValues.riskTolerance = $scope.selectData.findByValue('riskTolerance', angular.fromJson(sessionStorage.getItem("responseProduct")).riskLevelDescription);
            }

            if (localSession.accountApplication.investmentExperience) {
                $scope.financialValues.investmentExperience = localSession.accountApplication.investmentExperience;
            } else {
                $scope.financialValues.investmentExperience = $scope.selectData.findByValue('investmentExperience', sessionStorage.getItem("investmentExperience"));
            }

            if (localSession.accountApplication.investmentObjective) {
                $scope.financialValues.investmentObjective = localSession.accountApplication.investmentObjective;
            }

            if (localSession.accountApplication.liquidityNeeds) {
                $scope.financialValues.liquidityNeeds = localSession.accountApplication.liquidityNeeds;
            }

            if (localSession.accountApplication.liquidityNeeds) {
                $scope.financialValues.liquidityNeeds = localSession.accountApplication.liquidityNeeds;
            }

            if (localSession.accountApplication.timeHorizon) {
                $scope.financialValues.timeHorizon = localSession.accountApplication.timeHorizon;
            }

            //////////////////////////////
            // for step 2

            if (localSession.accountApplication.customerType) {
                $scope.customerType = localSession.accountApplication.customerType;
            }

            //////////////////////////////
            // two applicant-specific properties not in localSession

            if (sessionStorage.getItem("firstUserMailAddressSetting")) {
                $scope.firstApplicant.mailAddressSetting = (sessionStorage.getItem("firstUserMailAddressSetting") === "true");
            }

            if (sessionStorage.getItem("secondUserMailAddressSetting")) {
                $scope.secondApplicant.mailAddressSetting = (sessionStorage.getItem("secondUserMailAddressSetting") === "true");
            }

            //////////////////////////////
            // for steps 3, 4, and 5

            loadWorkspacesForApplicant(localSession, 0);

            //////////////////////////////
            // for steps 6, 7, and 8

            if (localSession.accountApplication.applicants.length > 1) {
                loadWorkspacesForApplicant(localSession, 1);
            }

            //////////////////////////////
            // for step 9

            if (localSession.accountApplication.jointCustomerDisposition) {
                $scope.firstApplicant.jointCustomerDisposition = localSession.accountApplication.jointCustomerDisposition;

                if (localSession.accountApplication.communityPropertyState) {
                    $scope.firstApplicant.communityPropertyState = localSession.accountApplication.communityPropertyState;
                }

                if (localSession.accountApplication.jointTenantsInCommonParticipants) {
                    $scope.firstApplicant.tenantsName = localSession.accountApplication.jointTenantsInCommonParticipants[0].name;
                    $scope.firstApplicant.estate = localSession.accountApplication.jointTenantsInCommonParticipants[0].estatePercent;
                    $scope.secondApplicant.tenantsName = localSession.accountApplication.jointTenantsInCommonParticipants[1].name;
                    $scope.secondApplicant.estate = localSession.accountApplication.jointTenantsInCommonParticipants[1].estatePercent;
                } else {
                    $scope.firstApplicant.estate = 50;
                    $scope.secondApplicant.estate = 50;
                }
            }

            //////////////////////////////
            // for step 10

            if (angular.fromJson(sessionStorage.getItem("agreementParts"))) {
                $scope.agreementParts = angular.fromJson(sessionStorage.getItem("agreementParts"));
                $scope.agreementCount = $scope.agreementParts.length;
                console.log("agreementCount", $scope.agreementCount);
            }
        };

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        $scope.init = function () {
            SelectDataService.getSelectData()
            .then(function (selectData) {
                    $scope.selectData = selectData.response;

                    loadWorkspaces();
                },
                function (data) {
                    console.log('selectData retrieval failed.')
                }
            );

            $scope.scrollTo();
        };

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        $scope.changeFirstEstate = function () {
            $scope.secondApplicant.estate = 100 - $scope.firstApplicant.estate;
        };

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        $scope.changeSecondEstate = function () {
            $scope.firstApplicant.estate = 100 - $scope.secondApplicant.estate;
        };

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        $scope.uploadFile = function () {
            console.log('upload');
            OpenAccountService.letterUpload($scope.firstApplicant.Letter);
        };

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        $scope.submitAsJSON = function () {

            if ($scope.agreementPartNumber == ($scope.agreementCount - 1)) {
                var localSessionConverted = prepareForSubmission(angular.fromJson(sessionStorage.getItem('localSession')));

                // if ($scope.individualAgreement != true || ($scope.jointAgreement != true)) {
                //     TextService.popup('accept_agreement');

                // } else {
                OpenAccountService.executeAgreement(sessionStorage.getItem("WIPItemID"))
                    .then(function (response) {
                            console.log("executeAgreement Response", response);

                            if (response.status && response.status.statusCode === "OK") {
                                $scope.jsonObj = angular.fromJson(sessionStorage.getItem("localSession"));

                                OpenAccountService.finalize(sessionStorage.getItem("WIPItemID"), localSessionConverted)
                                    .then(function (response) {
                                            console.log('finalize Response', response);

                                            if (response.status && response.status.statusCode == "OK") {
                                                sessionStorage.setItem("step_id", 0);
                                                $location.path("/open-account-success");

                                            } else {
                                                console.log('finalize Response Not OK.');

                                                angular.forEach(response.status.statusDetails.validationErrors, function(validationError) {
                                                    TextService.popup('validation_error', {data: [validationError.error]});
                                                });
                                            }
                                        },
                                        function (response) {
                                            console.log("finalize Failed", response);
                                        });

                            } else {
                                console.log("executeAgreement Not OK.");
                            }
                        },
                        function (response) {
                            console.log("executeAgreement Failed", response);
                        });
                // }
            } else {
                $scope.agreementPartNumber++;
                $scope.firstApplicant.checkName = '';
                $scope.secondApplicant.checkName = '';
            }

                
        };

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        $scope.popupFile = function (e) {
            angular.element(e.target).siblings('#upload').trigger('click');
        };

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////

        $scope.finishLater = function(stepId) {
            sessionStorage.setItem("resumeFlag", true);
            $route.reload();
            $rootScope.$broadcast("resumeFlag_selected");
            var localSession = angular.fromJson(sessionStorage.getItem('localSession'));
            var resumeEmail = localSession.accountApplication.applicants[0].emailAddresses[0];
            OpenAccountService.postPIN(resumeEmail)
            .then(function(response) {
                console.log('postPin', response);
                $location.path("/notify-wip");
            });
        };

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////

        $scope.nextResume = function() {
            if ($scope.needPin == 'true') {

                OpenAccountService.postPIN($scope.resumeEmail)
                .then(function(response) {
                    console.log('postPin', response);
                    $location.path("/notify-resume");
                });
                
            } else {
                sessionStorage.setItem("resumeEmail", $scope.resumeEmail);

                $location.path("/next-resume");
                $route.reload();
            }
        };

        $scope.resume = function() {

            var resumeEmail = sessionStorage.getItem("resumeEmail");

            $location.path('resume-account/' + resumeEmail + '/' + $scope.resumePin);
            $route.reload();

            // OpenAccountService.getWIP(resumeEmail, $scope.resumePin)
            // .then(function(response) {
            //     console.log("WIP response", response);
            //     console.log(angular.fromJson(sessionStorage.getItem("localSession")));
            //     // sessionStorage.setItem("localSession", response.response.data);
            //     var localSession = response.response.data;
            //     var target_url = "/open-account-2";
            //     if (localSession.accountApplication.investmentObjective) {
            //         target_url = "/open-account-3";
            //     }
            //     if (localSession.accountApplication.customerType) {
            //         target_url = "/open-account-4";
            //     }
            //     if (localSession.accountApplication.applicants[0].socialSecurityNumber) {
            //         target_url = "/open-account-5";
            //     }
            //     if (localSession.accountApplication.applicants[0].isAffiliatedExchangeOrFINRA) {
            //         target_url = "/open-account-6";
            //     }
            //     if (localSession.accountApplication.applicants[0].employmentStatus) {
            //         target_url = "/open-account-7";
            //     }
            //     if (localSession.accountApplication.applicants.length > 1) {
            //         if (localSession.accountApplication.applicants[1].socialSecurityNumber) {
            //             target_url = "/open-account-8";
            //         }
            //         if (localSession.accountApplication.applicants[1].isAffiliatedExchangeOrFINRA) {
            //             target_url = "/open-account-9";
            //         }
            //         if (localSession.accountApplication.applicants[1].employmentStatus) {
            //             target_url = "/open-account-10";
            //         }
            //         if (localSession.accountApplication.applicants[1].jointCustomerDisposition) {
            //             target_url = "/open-account-11";
            //         }
            //     }
            //     $location.path(target_url);
            //     $route.reload();
            // });
        };

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////

        $scope.init();
    };

    m.controller('OpenAccountController', [
        "$base64",
        "$cookies",
        "$filter",
        "$location",
        "$rootScope",
        "$scope",
        "$window",
        "$route",
        "OpenAccountService",
        "SelectDataService",
        "TextService",
        openAccountControllerFunction
    ]);
})();
