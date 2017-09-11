angular.module('DatePickerBtnDrtv', []).directive('btnDatepicker', function () {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            element.bind('click', function (e) {
                setTimeout(function() {
                    var elementId = attr.type + "DatePicker";
                    console.log(attr.type);
                    document.getElementById(elementId).click();
                }, 0);
            });
        }
    };
});