angular.module('OpenAccountDrtv', []).directive('openAccountStep', function() {
  return {
    templateUrl: function(element, attr) {
        // console.log(attr.type);
        return 'views/open_account/open_account_' + attr.type + '.html';
    }
  };
});