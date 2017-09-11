(function () {
    'use strict';

    var m = angular.module('TextServiceModule', []);

    var textServiceFunction = function ($http, $q, toastr) {

        var textLibrary = { // replace with $http when ready
            'en': {
                raw_data: '{0}',
                login_success: 'You have been logged in successfully.',
                login_failure: 'You could not be logged in.  {0}',
                change_password_success: 'Your password has been changed successfully.',
                change_password_failure: 'Your password could not be changed.  {0}',
                change_password_mismatch: 'The password and confirmation do not match.  Make sure you enter the same password twice to confirm the change.',
                accept_agreement: 'Please accept all agreements to continue.',
                validation_error: 'One or more validation issues has been encountered. {0}',
                signup_success: 'The password for your account has been set successfully.',
                signup_failure: 'The password for your account could not be set. {0}',
                confirm_password: 'Please enter your password twice to confirm that you typed it correctly.',
                tranfer_detail_failed: 'The details for this transfer could not be retrieved.',
                cancelled_account: 'The new account process has been cancelled.',
                successed_account: 'The new account has been added successfully.',
                error_account: 'The new account process could not be completed. {0}',
                cancelled_deposite: 'The deposit will be cancelled.',
                successed_deposite: 'The deposit was successfully completed.',
                error_deposite: 'The deposit could not be completed. {0}',
                cancelled_withdraw: 'The withdrawal will be cancelled.',
                successed_withdraw: 'The withdrawal was successfully completed.',
                error_withdraw: 'The withdrawal could not be completed. {0}',
                confirm_achRelationship_success: 'The ACH relationship will be confirmed with the values provided.',
                successed_cancelAch: 'Th ACH Relationship will be cancelled.',
                cancelled_cancelAch: 'The ACH relationship could not be cancelled.',
                percentageError: 'The total allocation specified by the sliders must add to 100%.  Try "Fix It" to automatically suggest adjusted allocations.'
            }
        };

        textLibrary.default = textLibrary.en;

        var getText = function (textId, localeId) {

            if (localeId && textLibrary[localeId]) {
                return textLibrary[localeId][textId];
            } else if (localeId && localeId.indexOf('-') >= 0 && textLibrary[localeId.split('-')[0]]) {
                return textLibrary[localeId.split('-')[0]][textId];
            } else {
                return textLibrary.default[textId];
            }
        };

        var replaceData = function (text, data) {
            var replacementText = text;

            if (data && data.length) {
                angular.forEach(data, function (v, i) {
                    replacementText = replacementText.replace('{' + i + '}', v ? v : '');
                });
            }

            return replacementText;
        };

        var popup = function (textId, options) { // replace with call to toastr JS or equivalent
            var text;

            if (options && options.localeId) {
                text = getText(textId, options.localeId);
            } else {
                text = getText(textId);
            }

            if (options && options.data) text = replaceData(text, options.data);
            if (textId == 'successed_withdraw' || textId == 'successed_deposite' || textId == 'login_success' || textId == 'change_password_success' || textId == 'signup_success' || textId == 'successed_account' || textId == 'successed_cancelAch' || textId == 'confirm_achRelationship_success') {
                toastr.success(text);
            } else if (textId == 'error_withdraw' || textId == 'error_deposite' || textId == 'login_failure' || textId == 'change_password_failure' || textId == 'validation_error' || textId == 'signup_failure' || textId == 'error_account' || textId == 'cancelled_cancelAch') {
                toastr.error(text);
            } else {
                toastr.warning(text);
            }
            // alert(text); // call toastr with options and return handle, for example.
        };

        // interface
        return {
            getText: getText,
            popup: popup
        };
    };

    m.factory('TextService', [
        '$http',
        '$q',
        'toastr',
        textServiceFunction
    ]);
})();
