(function() {
    'use strict';

    var m = angular.module('ApplicationIdleModule', []);
    m.run(function($document, AccountService, LoginService, $route, $rootScope, $location) {
        var lastPing = new Date();
        $document.find('body').on('mousedown keydown', function() {
            var timeSinceLastPing = ((new Date()) - lastPing) / 60000;

            if (timeSinceLastPing >= 3 && $rootScope.login_flag == true) { // only ping every 3 minutes
                AccountService.testToken()
                .then(function(response) {
                    if (response == "Unauthorized") {
                        LoginService.logout();
                        // .then(function(response) {
                        //     console.log("logout", response);
                        //     if (response.status.statusCode == "OK") {
                        $route.reload();
                        $rootScope.login_flag = false;
                        $location.path("/login");
                        //     }
                        //     else {
                        //         TextService.popup('raw_data', {data: [response.status.statusDescription]});
                        //     }
                        // });
                    }
                }); 
                // do the promise to test the token and redirect to login if is invalid
                // ...but this will have the effect of refreshing the token.
                // ...redirecting to login if it fails us just a good thing to do here as well.
                // ...NOTE: ignore timeouts & other errors.  Only re-direct on a good response, but one that says the token is invalid.

            }
            lastPing = new Date();
        });
    });
})();