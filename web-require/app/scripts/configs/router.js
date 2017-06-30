define(function (require) {
    var app = require('app');
    var $ = require('jquery');


    //用于初始化全局的数据，仅对全局作用域起作用
    app.run(function ($state, $stateParams, $rootScope, $anchorScroll) {
        $anchorScroll.yOffset = 70;
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        });
        $rootScope.$on('$stateChangeStart', function (evt, next, current) {

        });
        $rootScope.$on('$locationChangeStart', function () {
        });
        $rootScope.$on('$viewContentLoaded', function () {
        });

    });
    //配置信息
    app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$logProvider', function ($stateProvider, $urlRouterProvider, $httpProvider, $logProvider) {
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
                templateUrl: 'app/views/landing.html'
            })
        ;
        $urlRouterProvider.otherwise('');
    }]);
    // 拦截器
    app.factory('httpInterceptor', ['$q','$injector',function ($q, $injector) {
        // var commonService = $injector.get('commonService'); // 此处无法获取commonService
        var interceptor = {
            request: function (config) {
                // 在每次发送请求之前拦截，可以进行权限判断，或者参数处理等
                // 处理成功返回config，处理失败返回false，并提示处理结果
                return config;
            },
            response: function(res){
                // 在每次请求响应之后进行拦截，可以进行错误处理等
                // 出现错误，报告错误，返回res，没有错误，返回res
                return res;
            },
            requestError: function(request){
                // 请求之前发生了错误（请求没有发送到后台）
                // 打印错误详细信息，并处理错误
                return request;
            },
            responseError: function(response){
                // 请求经过后台处理后发生错误
                // 打印错误信息，并处理错误（一般都是跳转到错误页面，或提示用户联系客服等）
                return response;
            }
        };
        return interceptor;
    }]);
});
