angular.module('ProfileInvestmentDrtv', []).directive('profileInvestment', function() {
  return {
    templateUrl: function(element, attr) {
        return 'views/profile/profile_' + attr.type + '.html';
    }
  };
});