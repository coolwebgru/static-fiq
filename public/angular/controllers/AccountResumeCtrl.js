(function () {
    'use strict';

    var m = angular.module("AccountResumeCtrl", []);

    var accountResumeControllerFunction = function ($route, $location, $rootScope, $routeParams, $scope, GetCurrentUserService, AccountService, TextService, OpenAccountService, SelectDataService, $filter) {

        $scope.init = function () {
            console.log($route.current.params.email);
            console.log($route.current.params.pin);
            SelectDataService.getSelectData()
            .then(function (selectData) {
                $scope.selectData = selectData.response;

                    OpenAccountService.getWIP($route.current.params.email, $route.current.params.pin)
                    .then(function(response) {
                        if (response.status.statusCode == "OK") {
                            console.log("WIP response", response);
                            var localStorage = response.response.data;
                            var target_url = "/open-account-1";

                            var localSession = {
                                riskProfile: {
                                    riskScore: localStorage.riskProfile.riskScore,
                                    riskLevel: localStorage.riskProfile.riskLevel,
                                    riskLevelDescription: localStorage.riskProfile.riskLevelDescription,
                                    productAssignments: localStorage.riskProfile.productAssignments,
                                    questionAnswers: localStorage.riskProfile.questionAnswers
                                },
                                accountApplication: {
                                    annualIncomeUSD: $scope.selectData.findByValue('annualIncome', localStorage.riskProfile.questionAnswers.annualIncomeUSD),
                                    totalNetWorthUSD: $scope.selectData.findByValue('netWorth', localStorage.riskProfile.questionAnswers.totalNetWorthUSD),
                                    riskTolerance: $scope.selectData.findByValue('riskTolerance', localStorage.riskProfile.riskLevelDescription),
                                    // investmentExperience: $scope.selectData.findByValue('investmentExperience', localStorage.riskProfile.questionAnswers.investmentExperience),
                                    applicants: [
                                        {
                                            dateOfBirth: new Date(localStorage.riskProfile.questionAnswers.dateOfBirth),
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
                            if (localStorage.accountApplication.applicants[0].emailAddresses[0]) {
                                localSession.accountApplication.applicants[0].givenName = localStorage.accountApplication.applicants[0].givenName;
                                localSession.accountApplication.applicants[0].familyName = localStorage.accountApplication.applicants[0].familyName;
                                localSession.accountApplication.applicants[0].citizenshipCountry = $scope.selectData.findByValue('countries', localStorage.accountApplication.applicants[0].citizenshipCountry);
                                localSession.accountApplication.applicants[0].emailAddresses = [localStorage.accountApplication.applicants[0].emailAddresses[0]];
                                localSession.accountApplication.applicants[0].dateOfBirth = $filter('date')(localStorage.accountApplication.applicants[0].dateOfBirth, 'MM/dd/yyyy');

                                target_url = "/open-account-2";
                            }
                            else if (localStorage.accountApplication.investmentObjective) {
                                localSession.accountApplication.federalTaxBracketPercent = localStorage.accountApplication.federalTaxBracketPercent;

                                localSession.accountApplication.annualIncomeUSD = $scope.selectData.findByValue('annualIncome', localStorage.accountApplication.annualIncomeUSD);
                                localSession.accountApplication.investmentExperience = $scope.selectData.findByValue('annualIncome', localStorage.accountApplication.investmentExperience);
                                localSession.accountApplication.investmentObjective = $scope.selectData.findByValue('annualIncome', localStorage.accountApplication.investmentObjective);
                                localSession.accountApplication.liquidityNeeds = $scope.selectData.findByValue('annualIncome', localStorage.accountApplication.liquidityNeeds);
                                localSession.accountApplication.liquidNetWorthUSD = $scope.selectData.findByValue('annualIncome', localStorage.accountApplication.liquidNetWorthUSD);
                                localSession.accountApplication.riskTolerance = $scope.selectData.findByValue('annualIncome', localStorage.accountApplication.riskTolerance);
                                localSession.accountApplication.timeHorizon = $scope.selectData.findByValue('annualIncome', localStorage.accountApplication.timeHorizon);
                                localSession.accountApplication.totalNetWorthUSD = $scope.selectData.findByValue('annualIncome', localStorage.accountApplication.totalNetWorthUSD);
                                target_url = "/open-account-3";
                            }
                            if (localStorage.accountApplication.customerType) {
                                localSession.accountApplication.customerType = localStorage.accountApplication.customerType;
                                target_url = "/open-account-4";
                            }
                            if (localStorage.accountApplication.applicants[0].socialSecurityNumber) {
                                if (localStorage.accountApplication.applicants[0].maritalStatus) {
                                    localSession.accountApplication.applicants[0].maritalStatus = localStorage.accountApplication.applicants[0].maritalStatus;
                                }

                                if (localStorage.accountApplication.applicants[0].numDependents) {
                                    localSession.accountApplication.applicants[0].numDependents = localStorage.accountApplication.applicants[0].numDependents;
                                }

                                localSession.accountApplication.applicants[0].givenName = localStorage.accountApplication.applicants[0].givenName;
                                localSession.accountApplication.applicants[0].familyName = localStorage.accountApplication.applicants[0].familyName;
                                localSession.accountApplication.applicants[0].dateOfBirth = localStorage.accountApplication.applicants[0].dateOfBirth;
                                localSession.accountApplication.applicants[0].citizenshipCountry = $scope.selectData.findByValue('countries', localStorage.accountApplication.applicants[0].citizenshipCountry);
                                localSession.accountApplication.applicants[0].socialSecurityNumber = localStorage.accountApplication.applicants[0].socialSecurityNumber;

                                localSession.accountApplication.applicants[0].homeAddress = {
                                    streetAddress: [
                                        localStorage.accountApplication.applicants[0].homeAddress.streetAddress[0]
                                    ],
                                    city: localStorage.accountApplication.applicants[0].homeAddress.city,
                                    state: $scope.selectData.findByValue('states', localStorage.accountApplication.applicants[0].homeAddress.state),
                                    postalCode: localStorage.accountApplication.applicants[0].homeAddress.postalCode,
                                    country: $scope.selectData.findByValue('countries', localStorage.accountApplication.applicants[0].homeAddress.citizenshipCountry)
                                };

                                if (localStorage.accountApplication.applicants[0].mailingAddress) {
                                    localSession.accountApplication.applicants[0].mailingAddress = {
                                        streetAddress: [
                                            localStorage.accountApplication.applicants[0].mailingAddress.streetAddress[0]
                                        ],
                                        city: localStorage.accountApplication.applicants[0].mailingAddress.city,
                                        state: $scope.selectData.findByValue('states', localStorage.accountApplication.applicants[0].mailingAddress.state),
                                        postalCode: localStorage.accountApplication.applicants[0].mailingAddress.postalCode,
                                        country: $scope.selectData.findByValue('countries', localStorage.accountApplication.applicants[0].mailingAddress.citizenshipCountry)
                                    };
                                }
                                  

                                localSession.accountApplication.applicants[0].phoneNumbers = [
                                    {
                                        phoneNumber: localStorage.accountApplication.applicants[0].phoneNumbers[0].phoneNumber,
                                        phoneNumberType: $scope.selectData.findByValue('phoneNumberType', localStorage.accountApplication.applicants[0].phoneNumbers[0].phoneNumberType)
                                    }
                                ];

                                localSession.accountApplication.applicants[0].emailAddresses = [
                                    localStorage.accountApplication.applicants[0].emailAddresses[0]
                                ];
                                target_url = "/open-account-5";
                            }
                            if (localStorage.accountApplication.applicants[0].isAffiliatedExchangeOrFINRA) {

                                localSession.accountApplication.applicants[0].isAffiliatedExchangeOrFINRA = localStorage.accountApplication.applicants[0].isAffiliatedExchangeOrFINRA;
                                if (localStorage.accountApplication.applicants[0].isAffiliatedExchangeOrFINRA.affiliatedFINRA == "YES") {
                                    localSession.accountApplication.applicants[0].firmName = localStorage.accountApplication.applicants[0].firmName;
                                    localSession.accountApplication.applicants[0].affiliatedApproval = [
                                        localStorage.accountApplication.applicants[0].affiliatedApproval[0]
                                    ];
                                }

                                localSession.accountApplication.applicants[0].isControlPerson = localStorage.accountApplication.applicants[0].isControlPerson;
                                if (localStorage.accountApplication.applicants[0].isControlPerson == "YES") {
                                    if (localStorage.accountApplication.applicants[0].companySymbols && localStorage.accountApplication.applicants[0].companySymbols.length > 0) {
                                        localSession.accountApplication.applicants[0].companySymbols = localStorage.accountApplication.applicants[0].companySymbols.split('\n');
                                    } else {
                                        localSession.accountApplication.applicants[0].companySymbols = [];
                                    }
                                }

                                localSession.accountApplication.applicants[0].isPoliticallyExposed = localStorage.accountApplication.applicants[0].isPoliticallyExposed;
                                if (localStorage.accountApplication.applicants[0].isPoliticallyExposed == "YES") {
                                    if (localStorage.accountApplication.applicants[0].immediateFamily && localStorage.accountApplication.applicants[0].immediateFamily.length > 0) {
                                        localSession.accountApplication.applicants[0].immediateFamily = localStorage.accountApplication.applicants[0].immediateFamily.split('\n');
                                    } else {
                                        localSession.accountApplication.applicants[0].immediateFamily = [];
                                    }
                                    localSession.accountApplication.applicants[0].politicalOrganization = localStorage.accountApplication.applicants[0].politicalOrganization;
                                }

                                target_url = "/open-account-6";
                            }
                            if (localStorage.accountApplication.applicants[0].employmentStatus) {
                                localSession.accountApplication.applicants[0].employmentStatus = $scope.selectData.findByValue('employmentStatus', localStorage.accountApplication.applicants[0].employmentStatus);
                                if (localStorage.accountApplication.applicants[0].employmentStatus == "EMPLOYED") {
                                    localSession.accountApplication.applicants[0].positionEmployed = localStorage.accountApplication.applicants[0].positionEmployed;
                                    localSession.accountApplication.applicants[0].employer = localStorage.accountApplication.applicants[0].employer;

                                    if (localStorage.accountApplication.applicants[0].yearsEmployed) {
                                        localSession.accountApplication.applicants[0].yearsEmployed = localStorage.accountApplication.applicants[0].yearsEmployed;
                                    }

                                    var needBusinessAddress = false;
                                    needBusinessAddress = needBusinessAddress || localStorage.accountApplication.applicants[0].businessAddress.streetAddress[0];
                                    needBusinessAddress = needBusinessAddress || localStorage.accountApplication.applicants[0].businessAddress.city;
                                    needBusinessAddress = needBusinessAddress || localStorage.accountApplication.applicants[0].businessAddress.state;
                                    needBusinessAddress = needBusinessAddress || localStorage.accountApplication.applicants[0].businessAddress.postalCode;
                                    needBusinessAddress = needBusinessAddress || localStorage.accountApplication.applicants[0].businessAddress.country;

                                    if (needBusinessAddress) {
                                        localSession.accountApplication.applicants[0].businessAddress = {
                                            city: localStorage.accountApplication.applicants[0].businessAddress.city,
                                            postalCode: localStorage.accountApplication.applicants[0].businessAddress.postalCode,
                                            country: $scope.selectData.findByValue('countries', localStorage.accountApplication.applicants[0].businessAddress.country),
                                            state: $scope.selectData.findByValue('states', localStorage.accountApplication.applicants[0].businessAddress.state),
                                            streetAddress: [localStorage.accountApplication.applicants[0].businessAddress.streetAddress[0]]
                                        };
                                    }
                                }

                                target_url = "/open-account-7";
                            }
                            if (localStorage.accountApplication.applicants.length > 1) {
                                if (localStorage.accountApplication.applicants[1].socialSecurityNumber) {
                                    if (localStorage.accountApplication.applicants[1].maritalStatus) {
                                        localSession.accountApplication.applicants[1].maritalStatus = localStorage.accountApplication.applicants[1].maritalStatus;
                                    }

                                    if (localStorage.accountApplication.applicants[1].numDependents) {
                                        localSession.accountApplication.applicants[1].numDependents = localStorage.accountApplication.applicants[1].numDependents;
                                    }

                                    localSession.accountApplication.applicants[1].givenName = localStorage.accountApplication.applicants[1].givenName;
                                    localSession.accountApplication.applicants[1].familyName = localStorage.accountApplication.applicants[1].familyName;
                                    localSession.accountApplication.applicants[1].dateOfBirth = localStorage.accountApplication.applicants[1].dateOfBirth;
                                    localSession.accountApplication.applicants[1].citizenshipCountry = $scope.selectData.findByValue('countries', localStorage.accountApplication.applicants[1].citizenshipCountry);
                                    localSession.accountApplication.applicants[1].socialSecurityNumber = localStorage.accountApplication.applicants[1].socialSecurityNumber;

                                    localSession.accountApplication.applicants[1].homeAddress = {
                                        streetAddress: [
                                            localStorage.accountApplication.applicants[1].homeAddress.streetAddress[0]
                                        ],
                                        city: localStorage.accountApplication.applicants[1].homeAddress.city,
                                        state: $scope.selectData.findByValue('states', localStorage.accountApplication.applicants[1].homeAddress.state),
                                        postalCode: localStorage.accountApplication.applicants[1].homeAddress.postalCode,
                                        country: $scope.selectData.findByValue('countries', localStorage.accountApplication.applicants[1].homeAddress.citizenshipCountry)
                                    };

                                    if (localStorage.accountApplication.applicants[1].mailingAddress) {
                                        localSession.accountApplication.applicants[1].mailingAddress = {
                                            streetAddress: [
                                                localStorage.accountApplication.applicants[1].mailingAddress.streetAddress[0]
                                            ],
                                            city: localStorage.accountApplication.applicants[1].mailingAddress.city,
                                            state: $scope.selectData.findByValue('states', localStorage.accountApplication.applicants[1].mailingAddress.state),
                                            postalCode: localStorage.accountApplication.applicants[1].mailingAddress.postalCode,
                                            country: $scope.selectData.findByValue('countries', localStorage.accountApplication.applicants[1].mailingAddress.citizenshipCountry)
                                        };

                                    }
                                      
                                    localSession.accountApplication.applicants[1].phoneNumbers = [
                                        {
                                            phoneNumber: localStorage.accountApplication.applicants[1].phoneNumbers[0].phoneNumber,
                                            phoneNumberType: $scope.selectData.findByValue('phoneNumberType', localStorage.accountApplication.applicants[1].phoneNumbers[0].phoneNumberType)
                                        }
                                    ];

                                    localSession.accountApplication.applicants[1].emailAddresses = [
                                        localStorage.accountApplication.applicants[1].emailAddresses[0]
                                    ];

                                    target_url = "/open-account-8";
                                }
                                if (localStorage.accountApplication.applicants[1].isAffiliatedExchangeOrFINRA) {

                                    localSession.accountApplication.applicants[1].isAffiliatedExchangeOrFINRA = localStorage.accountApplication.applicants[1].isAffiliatedExchangeOrFINRA;
                                    if (localStorage.accountApplication.applicants[1].isAffiliatedExchangeOrFINRA.affiliatedFINRA == "YES") {
                                        localSession.accountApplication.applicants[1].firmName = localStorage.accountApplication.applicants[1].firmName;
                                        localSession.accountApplication.applicants[1].affiliatedApproval = [
                                            localStorage.accountApplication.applicants[1].affiliatedApproval[0]
                                        ];
                                    }

                                    localSession.accountApplication.applicants[1].isControlPerson = localStorage.accountApplication.applicants[1].isControlPerson;
                                    if (localStorage.accountApplication.applicants[1].isControlPerson == "YES") {
                                        if (localStorage.accountApplication.applicants[1].companySymbols && localStorage.accountApplication.applicants[1].companySymbols.length > 0) {
                                            localSession.accountApplication.applicants[1].companySymbols = localStorage.accountApplication.applicants[1].companySymbols.split('\n');
                                        } else {
                                          localSession.accountApplication.applicants[1].companySymbols = [];
                                        }
                                    }

                                    localSession.accountApplication.applicants[1].isPoliticallyExposed = localStorage.accountApplication.applicants[1].isPoliticallyExposed;
                                    if (localStorage.accountApplication.applicants[1].isPoliticallyExposed == "YES") {
                                        if (localStorage.accountApplication.applicants[1].immediateFamily && localStorage.accountApplication.applicants[1].immediateFamily.length > 0) {
                                            localSession.accountApplication.applicants[1].immediateFamily = localStorage.accountApplication.applicants[1].immediateFamily.split('\n');
                                        } else {
                                            localSession.accountApplication.applicants[1].immediateFamily = [];
                                        }
                                        localSession.accountApplication.applicants[1].politicalOrganization = localStorage.accountApplication.applicants[1].politicalOrganization;
                                    }
                                    target_url = "/open-account-9";
                                }
                                if (localStorage.accountApplication.applicants[1].employmentStatus) {

                                    localSession.accountApplication.applicants[1].employmentStatus = $scope.selectData.findByValue('employmentStatus', localStorage.accountApplication.applicants[1].employmentStatus);
                                    if (localStorage.accountApplication.applicants[1].employmentStatus == "EMPLOYED") {
                                        localSession.accountApplication.applicants[1].positionEmployed = localStorage.accountApplication.applicants[1].positionEmployed;
                                        localSession.accountApplication.applicants[1].employer = localStorage.accountApplication.applicants[1].employer;

                                        if (localStorage.accountApplication.applicants[1].yearsEmployed) {
                                            localSession.accountApplication.applicants[1].yearsEmployed = localStorage.accountApplication.applicants[1].yearsEmployed;
                                        }

                                        var needBusinessAddress = false;
                                        needBusinessAddress = needBusinessAddress || localStorage.accountApplication.applicants[1].businessAddress.streetAddress[0];
                                        needBusinessAddress = needBusinessAddress || localStorage.accountApplication.applicants[1].businessAddress.city;
                                        needBusinessAddress = needBusinessAddress || localStorage.accountApplication.applicants[1].businessAddress.state;
                                        needBusinessAddress = needBusinessAddress || localStorage.accountApplication.applicants[1].businessAddress.postalCode;
                                        needBusinessAddress = needBusinessAddress || localStorage.accountApplication.applicants[1].businessAddress.country;

                                        if (needBusinessAddress) {
                                            localSession.accountApplication.applicants[1].businessAddress = {
                                                city: localStorage.accountApplication.applicants[1].businessAddress.city,
                                                postalCode: localStorage.accountApplication.applicants[1].businessAddress.postalCode,
                                                country: $scope.selectData.findByValue('countries', localStorage.accountApplication.applicants[1].businessAddress.country),
                                                state: $scope.selectData.findByValue('states', localStorage.accountApplication.applicants[1].businessAddress.state),
                                                streetAddress: [localStorage.accountApplication.applicants[1].businessAddress.streetAddress[0]]
                                            };
                                        }
                                    }
                                    target_url = "/open-account-10";
                                }
                                if (localStorage.accountApplication.jointCustomerDisposition) {

                                    localSession.accountApplication.jointCustomerDisposition = $scope.selectData.findByValue('jointCustomerDisposition', localStorage.accountApplication.jointCustomerDisposition);

                                    if (localStorage.accountApplication.jointCustomerDisposition) {
                                        if (localStorage.accountApplication.jointCustomerDisposition == "COMMUNITY_PROPERTY") {
                                          localSession.accountApplication.communityPropertyState = $scope.selectData.findByValue('states', localStorage.accountApplication.communityPropertyState);

                                        } else if (localStorage.accountApplication.communityPropertyState == "TENANTS_IN_COMMON") {

                                            localSession.accountApplication.jointTenantsInCommonParticipants = [
                                                {
                                                    name: localStorage.accountApplication.jointTenantsInCommonParticipants[0].name,
                                                    estatePercent: localStorage.accountApplication.jointTenantsInCommonParticipants[0].estatePercent
                                                },
                                                {
                                                    name: localStorage.accountApplication.jointTenantsInCommonParticipants[1].name,
                                                    estatePercent: localStorage.accountApplication.jointTenantsInCommonParticipants[1].estatePercent
                                                }
                                            ];
                                        }
                                    }
                                    target_url = "/open-account-11";
                                }
                            }

                            sessionStorage.setItem('localSession', angular.toJson(localSession));
                            $location.path(target_url);
                            $route.reload();
                        } else {
                            TextService.popup('validation_error', {data: [response.status.statusDescription]});
                        }
                            
                    });
                },
                function (data) {
                    console.log('selectData retrieval failed.')
                }
            );
            $('html, body').animate({
                scrollTop: 0
            }, 500);
        };

        $scope.init();
    };

    m.controller('AccountResumeController', [
        '$route',
        '$location',
        '$rootScope',
        '$routeParams',
        '$scope',
        'GetCurrentUserService',
        'AccountService',
        'TextService',
        'OpenAccountService',
        'SelectDataService',
        '$filter',
        accountResumeControllerFunction
    ]);
})();
