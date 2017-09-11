angular.module('OpenAccountQuestionDrtv', []).directive('openAccountQuestion', function() {
  return {
    templateUrl: function(element, attr) {
        // console.log(attr.type);
        return 'views/open_account_question/open_account_' + attr.type + '.html';
    }
  };
});