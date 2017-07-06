angular.module('app')
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $logProvider, $translateProvider, lang) {

        // 配置国际化
        $translateProvider.translations('lang', lang);
        $translateProvider.preferredLanguage('lang');

        $logProvider.debugEnabled(false);
        $httpProvider.interceptors.push('httpInterceptor');
        //配置路由
        $stateProvider
            .state('login', {
                url: '',
                templateUrl: 'app/views/login/login.html',
                controller: 'LoginController'
            })
            .state('home', {
                abstract: true,
                url: '/home', // url必须以"/"开头,否则在前进后退的时候会出现找不到路径的情况
                templateUrl: 'app/views/home.html'
            })
            .state('home.landing', {
                url: '/landing',
                templateUrl: 'app/views/landing.html',
                controller: 'LandingController'
            })
        ;
        $urlRouterProvider.otherwise('');
    });


