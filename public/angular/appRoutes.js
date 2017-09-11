angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider',  function($routeProvider, $locationProvider) {
  	$routeProvider
  		// home page
  		.when('/', {
  			templateUrl: 'views/home.html',
  			controller: 'HomeController'
  		})
      .when('/open-account-success', {
        templateUrl: 'views/open_account/open_account.html',
        controller: 'OpenAccountController'
      })
      .when('/account-overview', {
  			templateUrl: 'views/investment/account_overview.html',
  			controller: 'AccountController'
  		})
      .when('/account-overview/history', {
        templateUrl: 'views/investment/account_history.html',
        controller: 'AccountController'
      })
      .when('/account-overview/add-money', {
        templateUrl: 'views/investment/account_add_to_myaccount.html',
        controller: 'AccountController'
      })
      .when('/account-overview/all-transfers', {
        templateUrl: 'views/investment/account_all_transfer.html',
        controller: 'AccountController'
      })
      .when('/account-overview/holdings', {
        templateUrl: 'views/investment/account_holdings.html',
        controller: 'AccountController'
      })
      .when('/account-overview/withdraw-money', {
        templateUrl: 'views/investment/account_withdraw_money_from_myaccount.html',
        controller: 'AccountController'
      })
      .when('/account-overview/documents', {
        templateUrl: 'views/investment/account_document.html',
        controller: 'AccountController'
      })
      .when('/open-account-question-1', {
        templateUrl: 'views/open_account_question/open_account_question_1.html',
        controller: 'OpenAccountQuestionController'
      })
      .when('/open-account-question-2', {
        templateUrl: 'views/open_account_question/open_account_question_2.html',
        controller: 'OpenAccountQuestionController'
      })
      .when('/adaptive-dynamic-portfolios', {
        templateUrl: 'views/offerings/adaptive_dynamic_portfolios.html',
        controller: 'HomeController'
      })
      .when('/investment-benefits', {
        templateUrl: 'views/offerings/investment_benefits.html',
        controller: 'HomeController'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
      })
      .when('/about', {
        templateUrl: 'views/about/about.html',
        controller: 'HomeController'
      })
      .when('/methodology', {
        templateUrl: 'views/offerings/methodology.html',
        controller: 'HomeController'
      })
      .when('/open-account-cart', {
        templateUrl: 'views/open_account_cart/open_account_cart.html',
        controller: 'OpenAccountCartController'
      })
      .when('/resume', {
        templateUrl: 'views/WIP/resume.html',
        controller: 'OpenAccountController'
      })
      .when('/next-resume', {
        templateUrl: 'views/WIP/next_resume.html',
        controller: 'OpenAccountController'
      })
      .when('/notify-wip', {
        templateUrl: 'views/WIP/notify_wip.html',
        controller: 'OpenAccountController'
      })
      .when('/notify-resume', {
        templateUrl: 'views/WIP/notify_resume.html',
        controller: 'OpenAccountController'
      })
      .when('/open-account-1', {
        templateUrl: 'views/open_account/open_account_step_0.html',
        controller: 'OpenAccountController'
      })
      .when('/open-account-2', {
        templateUrl: 'views/open_account/open_account_step_1.html',
        controller: 'OpenAccountController'
      })
      .when('/open-account-3', {
        templateUrl: 'views/open_account/open_account_step_2.html',
        controller: 'OpenAccountController'
      })
      .when('/open-account-4', {
        templateUrl: 'views/open_account/open_account_step_3.html',
        controller: 'OpenAccountController'
      })
      .when('/open-account-5', {
        templateUrl: 'views/open_account/open_account_step_4.html',
        controller: 'OpenAccountController'
      })
      .when('/open-account-6', {
        templateUrl: 'views/open_account/open_account_step_5.html',
        controller: 'OpenAccountController'
      })
      .when('/open-account-7', {
        templateUrl: 'views/open_account/open_account_step_6.html',
        controller: 'OpenAccountController'
      })
      .when('/open-account-8', {
        templateUrl: 'views/open_account/open_account_step_7.html',
        controller: 'OpenAccountController'
      })
      .when('/open-account-9', {
        templateUrl: 'views/open_account/open_account_step_8.html',
        controller: 'OpenAccountController'
      })
      .when('/open-account-10', {
        templateUrl: 'views/open_account/open_account_step_9.html',
        controller: 'OpenAccountController'
      })
      .when('/open-account-11', {
        templateUrl: 'views/open_account/open_account_step_10.html',
        controller: 'OpenAccountController'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignUpController',
      })
      .when('/add-bank-account', {
        templateUrl: 'views/add_bank_account.html',
        controller: 'HomeController'
      })
      .when('/news', {
        templateUrl: 'views/news_update.html',
        controller: 'HomeController'
      })
      .when('/news/date/2015-12', {
        templateUrl: 'views/news_by_date.html',
        controller: 'HomeController'
      })
      .when('/news/tag/personal-finances', {
        templateUrl: 'views/news_by_finances.html',
        controller: 'HomeController'
      })
      .when('/news/tag/savings', {
        templateUrl: 'views/news_by_savings.html',
        controller: 'HomeController'
      })
      .when('/single-post/2015/11/29/No-More-Saving', {
        templateUrl: 'views/no_more_saving.html',
        controller: 'HomeController'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'HomeController'
      })
      .when('/terms-conditions', {
        templateUrl: 'views/terms_conditions.html',
        controller: 'HomeController'
      })
      .when('/cutting-edge-technology', {
        templateUrl: 'views/cutting_edge_technology.html',
        controller: 'HomeController'
      })
      .when('/rule-based', {
        templateUrl: 'views/rule_based.html',
        controller: 'HomeController'
      })
      .when('/faqs', {
        templateUrl: 'views/faqs/faqs.html',
        controller: 'HomeController'
      })
      .when('/profile', {
        templateUrl: 'views/profile/profile_personal_info.html',
        controller: 'ProfileController'
      })
      .when('/profile/investment-preference', {
        templateUrl: 'views/profile/profile_invest_preference.html',
        controller: 'ProfileController'
      })
      .when('/profile/security', {
        templateUrl: 'views/profile/profile_change_password.html',
        controller: 'ProfileController'
      })
      .when('/open-account', {
        templateUrl: 'views/open_account/open_account.html',
        controller: 'OpenAccountController'
      })
      .when('/account-overview/add-new', {
        templateUrl: 'views/investment/add_new_money_page.html',
        controller: 'AccountController'
      })
      .when('/account-overview/deposit/', {
        templateUrl: 'views/investment/deposit_form.html',
        controller: 'AccountController'
      })
      .when('/account-overview/withdraw/', {
        templateUrl: 'views/investment/withdraw_form.html',
        controller: 'AccountController'
      })
      .when('/faqs-getting-started', {
        templateUrl: 'views/faqs/faqs_getting_started.html',
        controller: 'HomeController'
      })
      .when('/help-center', {
        templateUrl: 'views/faqs/faqs.html',
        controller: 'HomeController'
      })
      .when('/faqs-account-funding', {
        templateUrl: 'views/faqs/faqs_account_funding.html',
        controller: 'HomeController'
      })
      .when('/faqs-my-iq-vestment', {
        templateUrl: 'views/faqs/faqs_my_iq_vestment.html',
        controller: 'HomeController'
      })
      .when('/faqs-education-center', {
        templateUrl: 'views/faqs/faqs_education_center.html',
        controller: 'HomeController'
      })
      .when('/faqs-fund-my-account', {
        templateUrl: 'views/faqs/faqs_fund_my_account.html',
        controller: 'HomeController'
      })
      .when('/faqs-transfer-rollovers', {
        templateUrl: 'views/faqs/faqs_transfer_rollovers.html',
        controller: 'HomeController'
      })
      .when('/faqs-additional-funds', {
        templateUrl: 'views/faqs/faqs_additional_funds.html',
        controller: 'HomeController'
      })
      .when('/faqs-account-held', {
        templateUrl: 'views/faqs/faqs_account_held.html',
        controller: 'HomeController'
      })
      .when('/faqs-micro-deposits', {
        templateUrl: 'views/faqs/faqs_micro_deposits.html',
        controller: 'HomeController'
      })
      .when('/faqs-account-types', {
        templateUrl: 'views/faqs/faqs_account_types.html',
        controller: 'HomeController'
      })
      .when('/faqs-retirement-accounts', {
        templateUrl: 'views/faqs/faqs_retirement_accounts.html',
        controller: 'HomeController'
      })
      .when('/faqs-ira-transfer', {
        templateUrl: 'views/faqs/faqs_ira_transfer.html',
        controller: 'HomeController'
      })
      .when('/faqs-fees', {
        templateUrl: 'views/faqs/faqs_fees.html',
        controller: 'HomeController'
      })
      .when('/faqs-transfer-account', {
        templateUrl: 'views/faqs/faqs_transfer_account.html',
        controller: 'HomeController'
      })
      .when('/faqs-employee-sponsor', {
        templateUrl: 'views/faqs/faqs_employee_sponsor.html',
        controller: 'HomeController'
      })
      .when('/faqs-account-domicile', {
        templateUrl: 'views/faqs/faqs_account_domicile.html',
        controller: 'HomeController'
      })
      .when('/faqs-traditional-vs-roth-ira', {
        templateUrl: 'views/faqs/faqs_traditional_vs_roth_ira.html',
        controller: 'HomeController'
      })
      .when('/faqs-401k-consolidation', {
        templateUrl: 'views/faqs/faqs_401k_consolidation.html',
        controller: 'HomeController'
      })
      .when('/faqs-getting-started-iq', {
        templateUrl: 'views/faqs/faqs_getting_started_iq.html',
        controller: 'HomeController'
      })
      .when('/investment-choices', {
        templateUrl: 'views/open_account_cart/investment_choices.html',
        controller: 'InvestmentChoicesController'
      })
      .when('/investment-details', {
        templateUrl: 'views/open_account_cart/investment_details.html',
        controller: 'InvestmentDetailsController'
      })
      // .when('/personalized-iqvestment', {
      //   templateUrl: 'views/open_account_cart/personalized_iqvestment.html',
      //   controller: 'ChoiceDetailsController'
      // })
      .when('/adp-cart-details', {
        templateUrl: 'views/offerings/adp_cart_details.html',
        controller: 'ChoiceDetailsController'
      })
      // .when('/investment-all-choices', {
      //   templateUrl: 'views/open_account_cart/investment_all_choices.html',
      //   controller: 'ChoiceDetailsController'
      // })
      .when('/offerings', {
        templateUrl: 'views/offerings/offerings.html',
        controller: 'HomeController'
      })
      .when('/adp-gallery', {
        templateUrl: 'views/offerings/adp_gallery.html',
        controller: 'AdpGalleryController'
      })
      .when('/all-intellicarts', {
        templateUrl: 'views/offerings/all_intellicarts.html',
        controller: 'HomeController'
      })
      .when('/portfolio-gallery', {
        templateUrl: 'views/open_account_cart/portfolio_gallery.html',
        controller: 'ChoiceDetailsController'
      })
      .when('/news-media', {
        templateUrl: 'views/news_media/news_media.html',
        controller: 'NewsBlogController'
      })
      .when('/blog', {
        templateUrl: 'views/news_media/blog.html',
        controller: 'NewsBlogController'
      })
      .when('/company-news', {
        templateUrl: 'views/news_media/company_news.html',
        controller: 'NewsBlogController'
      })
      .when('/videos', {
        templateUrl: 'views/news_media/videos.html',
        controller: 'NewsBlogController'
      })
      .when('/careers', {
        templateUrl: 'views/careers.html',
        controller: 'HomeController'
      })
      .when('/legal', {
        templateUrl: 'views/legal.html',
        controller: 'HomeController'
      })
      .when('/forgot-password', {
        templateUrl: 'views/forgot_password.html',
        controller: 'LoginController'
      })
      .when('/resume-account/:email/:pin', {
        templateUrl: 'views/WIP/resume_account.html',
        controller: 'AccountResumeController'  
      });
}]);
