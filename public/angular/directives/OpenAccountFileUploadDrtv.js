angular.module('OpenAccountFileUploadDrtv', []).directive('uploadfile', function () {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.bind('click', function (e) {
                setTimeout(function() {
                    document.getElementById('portfolio-upload').click();
                }, 0);
            });
        }
    };
}).directive("fileread", function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0];
                    scope.displayFN = scope.fileread.name;
                    console.log(scope.fileread);
                });
            });
        }
    }
});