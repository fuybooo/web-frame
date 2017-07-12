var host = '127.0.0.1';// 本地使用的ip
// var host = '47.94.0.247';// 服务器上的ip
var port = 3003;
var wsPort = 3004;
angular.module('templates', []);
angular.module('app', ['ui.router', 'ui.load', 'ngSanitize', 'ngAnimate', 'ngTouch', 'pascalprecht.translate'/* 国际化 */, 'templates'])
    .run(function ($state, $stateParams, $rootScope, $anchorScroll, dataService, lang, routers) {

        $rootScope.$on('$locationChangeStart', function (evt, current, prev) {
            // 根据current获取对应的state
            var currentState;
            var symbolIndex_1 =current.indexOf('#!');
            if(symbolIndex_1 === -1){
                currentState = routers.login;
            }else{
                var symbolIndex_2 = current.indexOf('?');
                // 从#!/中的/后的第一个字符开始截取:如 http://localhost:3000/#!/app/dashboard 截取完成是app/dashboard
                var anchor = current.slice(symbolIndex_1 + 3, symbolIndex_2 === -1 ? current.length : symbolIndex_2);
                currentState = anchor.split('/').join('.');
            }
            // 对错误的锚点进行处理
            // 不能为抽象路径, 不能为router之外的
            if(currentState === 'app' || !(currentState in routers)){
                console.error('错误的路径！');
            }

            // 为了防止用户在已经登录系统的情况下再次进入登录界面,需要在用户跳转到登录界面时判断后台是否存在用户的session信息
            // 如果存在,则直接进入登录后的界面,否则停留在登录界面.
            if (currentState === routers.login) {
                dataService.get(dataService.URL.hasSession, function (data) {
                    if (data.code === 0) {
                        // 说明后台已经有session了
                        $state.go('home.landing');
                    }
                });
            }
        });
        $rootScope.$on('$viewContentLoaded', function (evt, viewConfig) {
            // 执行次数为当前页面中ui-view指令的个数，为了减少执行次数，需要做判断
            // 判断该视图是非抽象视图且不是导航栏视图
            if (viewConfig && viewConfig.viewDecl.templateUrl.indexOf('/app.html') === -1) {
                // 页面加载完成之后显示标题
                $rootScope.pageTitle = lang[$state.current.name];
            }

        });

    })
    // 拦截器
    .factory('httpInterceptor', ['$q', '$injector', function ($q, $injector) {
        return {
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



