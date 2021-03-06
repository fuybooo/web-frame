// 设置国际化
$.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['zh-CN']);


var host = '127.0.0.1';// 本地使用的ip
// var host = '47.94.0.247';// 服务器上的ip
var port = 3003;
var wsPort = 3004;
angular.module('templates', []);
angular.module('app', ['ui.router', 'ui.load', 'ngSanitize', 'ngAnimate', 'ngTouch', 'pascalprecht.translate'/* 国际化 */, 'templates'])
    .run(function ($state, $stateParams, $rootScope, $anchorScroll) {
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

    })
    // 拦截器
    .factory('httpInterceptor', ['$q', '$injector', function ($q, $injector) {
        var interceptor = {
            request: function (config) {
                // 在每次发送请求之前拦截，可以进行权限判断，或者参数处理等
                // 处理成功返回config，处理失败返回false，并提示处理结果
                return $q.when(config);
            },
            response: function (res) {
                // 在每次请求响应之后进行拦截，可以进行错误处理等
                // 出现错误，报告错误，返回res，没有错误，返回res
                return $q.when(res);
            },
            requestError: function (request) {
                // 请求之前发生了错误（请求没有发送到后台）
                // 打印错误详细信息，并处理错误
                return request;
            },
            responseError: function (response) {
                // 请求经过后台处理后发生错误
                // 打印错误信息，并处理错误（一般都是跳转到错误页面，或提示用户联系客服等）
                return response;
            }
        };
        return interceptor;
    }])
    //配置APP
    .config(function ($httpProvider, $translateProvider) {

        // Use x-www-form-urlencoded Content-Type
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function (obj) {
            var query = '',
                name, value, fullSubName, subName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        //一个function数组，负责将请求的body，也就是post data，转换成想要的形式
        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function (data) {
            if (String(data) === '[object FormData]')return data;
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
    })
    .constant('baseRequestUrl', 'http://' + host + ':' + port + '/')
    .constant('webSocketUrl', 'ws://' + host + ':' + wsPort)
    .constant('baseStaticUrl', 'app/')
;


/**
 * 启动angular
 */

angular.element(document).ready(function () {
    angular.bootstrap(document, ['app']);
});


