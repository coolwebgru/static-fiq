(function () {
    'use strict';

    var m = angular.module('OpenAccountQuestionCtrl', []);

    var openAccountQuestionControllerFunction = function ($cookies, $filter, $location, $rootScope, $scope, $window, RiskProfileService, SelectDataService, TextService) {

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        $scope.init = function () {

            if (sessionStorage.getItem("selectedProducts")) {
                sessionStorage.removeItem("selectedProducts");
            }

            if (sessionStorage.getItem("availableProducts")) {
                sessionStorage.removeItem("availableProducts");
            }
            SelectDataService.getSelectData()
                .then(function (selectData) {
                    $scope.selectData = selectData.response;
                    restoreFormInputs();
                });
            $scope.advisor = [];
            setTimeout(function () {
                $('html, body').animate({
                    scrollTop: 0
                }, 500);
            }, 500);
        };

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        $scope.workspaces =
            [
                {id: 1, name: "question_1", active: false},
                {id: 2, name: "question_2", active: false}
            ];

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        var setAllInactive = function () {
            angular.forEach($scope.workspaces, function (workspace) {
                workspace.active = false;
            });
        };

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        var saveWorkspace = function(id) {

            switch (id) {
                case 0:
                    var question_1_Object = {
                        dateOfBirth: $scope.dateOfBirth,
                        retirementAge: $scope.retirementAge,
                        totalNetWorthUSD: $scope.accountNetWorth,
                        annualIncomeUSD: $scope.accountAnnualIncome,
                        investmentExperience: $scope.investmentExperience
                    };

                    sessionStorage.setItem("question_1_Object", angular.toJson(question_1_Object));

                    break;

                case 1:
                    var question_2_Object = {
                        accountCompanySize: $scope.accountCompanySize,
                        accountReaction: $scope.accountReaction,
                        accountAdvisorPreference: $scope.accountAdvisorPreference
                    };
                    if ($scope.accountAdvisorPreference) {
                        if ($scope.accountAdvisorPreference.value == "WITH_ADVISOR") {
                            question_2_Object.advisorName = $scope.advisor.name;
                            question_2_Object.advisorPhone = $scope.advisor.phone;
                            question_2_Object.advisorEmail = $scope.advisor.email;
                        }    
                    }
                    sessionStorage.setItem("question_2_Object", angular.toJson(question_2_Object));

                    break;
            }
        };

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        $scope.changeWorkspace = function (from_id, to_id) {

            saveWorkspace(from_id);

            $("#question_" + (to_id + 1) + "_status").addClass('active');

            setAllInactive();

            setTimeout(function () {
                $scope.workspaces[to_id]['active'] = true;
                $('html, body').animate({
                    scrollTop: 0
                }, 500);
            }, 500);
        };

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        var restoreFormInputs = function () {
            

            var question_1_Object = sessionStorage.getItem('question_1_Object');
            if (question_1_Object) question_1_Object = angular.fromJson(question_1_Object);

            var question_2_Object = sessionStorage.getItem('question_2_Object');
            if (question_2_Object) question_2_Object = angular.fromJson(question_2_Object);

            if (question_1_Object || question_2_Object) {
                if (question_1_Object) {
                    $scope.dateOfBirth = $filter('date')(new Date(question_1_Object.dateOfBirth), 'MM/dd/yyyy');
                    $scope.retirementAge = question_1_Object.retirementAge;
                    $scope.accountAnnualIncome = question_1_Object.annualIncomeUSD;
                    $scope.accountNetWorth = question_1_Object.totalNetWorthUSD;
                    $scope.investmentExperience = question_1_Object.investmentExperience;
                }

                if (question_2_Object) {
                    $scope.accountCompanySize = question_2_Object.accountCompanySize;
                    $scope.accountReaction = question_2_Object.accountReaction;
                    $scope.accountAdvisorPreference = question_2_Object.accountAdvisorPreference;
                    if ($scope.accountAdvisorPreference) {
                        if ($scope.accountAdvisorPreference.value == "WITH_ADVISOR") {
                            $scope.advisor.name = question_2_Object.advisorName;
                            $scope.advisor.phone = question_2_Object.advisorPhone;
                            $scope.advisor.email = question_2_Object.advisorEmail;
                        }
                    }
                }

            } else {
                $location.path("/open-account-question-1");
            }
        };

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        $scope.submitQuestions = function () {
            angular.forEach($scope.workspaces, function(w) { saveWorkspace(w.id); });
            sessionStorage.setItem("investmentExperience", $scope.investmentExperience);
            
            var submitJSON = {
                "dateOfBirth": $filter('date')(new Date($scope.dateOfBirth), 'MM/dd/yyyy'),
                "retirementAge": $scope.retirementAge,
                "annualIncomeUSD": $scope.accountAnnualIncome.value,
                "totalNetWorthUSD": $scope.accountNetWorth.value,
                "investmentExperience": $scope.investmentExperience.value,
                "companySizePreference": $scope.accountCompanySize.value,
                "reactionToCorrection": $scope.accountReaction.value,
                "advisorPreference": $scope.accountAdvisorPreference.value
            };

            if ($scope.accountAdvisorPreference.value == "WITH_ADVISOR") {
                var advisorInfo = {
                    "advisorName": $scope.advisor.name,
                    "advisorPhone": $scope.advisor.phone,
                    "advisorEmail": $scope.advisor.email
                };
                sessionStorage.setItem("advisorInfo", angular.toJson(advisorInfo));
                console.log(angular.fromJson(sessionStorage.getItem("advisorInfo")));
            }
            

            RiskProfileService.getRiskProfile(submitJSON)
                .then(function (response) {
                    if (response.status.statusCode == "ERROR_VALIDATION") {
                        console.log(response);
                        TextService.popup('validation_error', { data: [ response.status.statusDetails.validationErrors[0].error ] });
                        $location.path("open-account-question-1");

                    } else {
                        console.log("riskProfile", response);
                        sessionStorage.setItem("responseProduct", angular.toJson(response.response));
                        sessionStorage.setItem("investmentExperience", $scope.investmentExperience.value);
                        $rootScope.responseProduct = response.response;
                        $location.path('open-account-cart');
                    }
                });
        };

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        $scope.clickedOpenAccount = function () {
            $rootScope.getStartedFlag = 0;
        };

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        $scope.init();

    };

    m.controller('OpenAccountQuestionController', [
        "$cookies",
        "$filter",
        "$location",
        "$rootScope",
        "$scope",
        "$window",
        "RiskProfileService",
        "SelectDataService",
        "TextService",
        openAccountQuestionControllerFunction
    ]);
})();
