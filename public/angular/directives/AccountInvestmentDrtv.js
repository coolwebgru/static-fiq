angular.module('AccountInvestmentDrtv', []).directive('accountInvestment', function() {
  return {
    templateUrl: function(element, attr) {
        return 'views/investment/account_' + attr.type + '.html';
    }
  };
});