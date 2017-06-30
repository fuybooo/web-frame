angular.module('app')
//配置信息
.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $logProvider) {
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


