angular.module('PositiveNumberDrtv', []).directive('validNumber', function() {
  	return {
	    restrict: "A",
	    require: '?ngModel',
	    link: function(scope, element, attrs, ngModelCtrl) {
	        if (!ngModelCtrl) {
	            return;
	        }

	        ngModelCtrl.$parsers.push(function(val) {
	           if (val === null)
	            return;
	           var myRegex = /\d+\.(\d{1,2})?/;
	           var clean = myRegex.exec(val)[0];
	           if (val != clean) {
	               ngModelCtrl.$setViewValue(clean);
	               ngModelCtrl.$render();
	           }
	           return clean;
	        });

	        element.bind('keypress', function(event) {
	            if (event.keyCode === 32) {
	                event.preventDefault();
	            }
	        });
	    }
    };
});