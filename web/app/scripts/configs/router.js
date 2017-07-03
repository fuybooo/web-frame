angular.module('app')
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $logProvider, $translateProvider, lang) {

        // 配置国际化
        $translateProvider.translations('lang', lang);
        $translateProvider.preferredLanguage('lang');

        $logProvider.debugEnabled(false);
        $httpProvider.interceptors.push('httpInterceptor');
        //配置路由
        $stateProvider
            .state('home', {
                abstract: true,
                url: '',
                templateUrl: 'app/views/home.html'
            })
            .state('home.landing', {
                url: '',
                templateUrl: 'app/views/landing.html',
                controller: 'LandingController'
            })
        ;
        $urlRouterProvider.otherwise('');
    });


