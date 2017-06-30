define(function(require) {
    var app = require('app');
    var angular = require('angular');
    app.factory('dataService', function ($http,$injector, baseRequestUrl, baseStaticUrl, webSocketUrl) {
        var service = {};
        /**
         * 请求资源
         */
        var request = function () {
            var url, param, cb_s, cb_e, promise;
            var method = arguments[0];
            angular.forEach(arguments[1], function (value) {
                if (typeof value === 'string') {
                    url = value;
                } else if (typeof value === 'object') {
                    param = value;
                } else if (typeof value === 'function') {
                    if (cb_s) {
                        cb_e = value;
                    } else {
                        cb_s = value;
                    }
                }
            });
            
            promise = service.getPromise(method, url, param);

            //
            var commonService = $injector.get('commonService');
            promise.success(function(res){
                if(method !== 'GET'){
                    if(res.msg){
                        commonService.alert(res.msg, res.code);
                    }
                }
                if(cb_s){
                    cb_s(res);
                }
            }).error(function(res){
                commonService.alert(res.msg || '发生严重错误！', res.code);
                if(cb_e){
                    cb_e(res);
                }
            });
        };
        service.get = function () {
            request('GET', arguments);
        };
        service.post = function () {
            request('POST', arguments);
        };
        
        
        /**
         * 请求返回promise对象
         * 如果只传一个url作为参数，则请求静态资源，目前只限制.html和.json两种格式
         * @param type
         * @param url
         * @param data
         * @returns {*}
         */
        service.getPromise = function (type, url, data) {
            // url以.html或者.json结尾，则请求静态资源
            // 否则请求服务器资源
            if (arguments.length === 1) {
                type = 'GET';
                url = arguments[0];
            }
            var requestType = url.slice(-5);
            if (requestType === '.html') {
                url = baseStaticUrl + 'views/';
            } else if (requestType === '.json') {
                url = baseStaticUrl + 'json/';
            } else {
                url = baseRequestUrl + url;
            }
            var options = {
                url: url,
                withCredentials: true
            };
            if (type === 'GET') {
                options.method = 'GET';
                if (data) {
                    options.params = data;
                }
            } else {
                options.method = 'POST';
                if (data) {
                    options.data = data;
                }
            }
            return $http(options);
        };
        /**
         * 建立webSocket,使用单例模式
         */
        // var createWebSocket = (function (address) {
        //     var ws = null;
        //     var init = function () {
        //         try {
        //             // ws = new WebSocket(webSocketUrl + (address || ''));
        //         } catch (e) {
        //
        //         }
        //         return ws;
        //     };
        //     return {
        //         getInstance: function () {
        //             return ws || init();
        //         }
        //     };
        // })();
        // service.webSocket = createWebSocket.getInstance();
        
        /**
         * 获取人员信息
         * @param params
         * @param callback
         */
        service.getUsers = function (params, callback) {
            service.get('user', params, callback);
        };
        /**
         * 注册
         */
        service.doRegister = function (params, callback) {
            service.post('register', params, callback);
        };
        /**
         * 登录
         */
        service.doLogin = function (params, callback) {
            service.post('login', params, callback);
        };
        /**
         * 退出
         */
        service.doLogout = function () {
            service.get('logout');
        };
        /**
         * 获取学生分数
         */
        service.getStudentsScores = function (callback) {
            service.get('studentsScores', callback);
        };
        /**
         * 处理人员信息,添加或修改
         */
        service.handleUser = function (params, callback) {
            service.post('handleUser', params, callback);
        };
        /**
         * 快速编辑
         * @param url
         * @param params
         * @param callback
         */
        service.quickEdit = function (url, params, callback) {
            service.post(url, params, callback);
        };
        /**
         * 验证敏感字
         * @param value
         * @param callback
         */
        service.validateSensitiveWord = function(value, callback){
            service.post('sensitiveWord', {value: value, action: 'validate'}, callback);
        };

        /*============================================= 从下面可以看出，一个模块只需要两个请求接口即可—— postXXX getXXX =============================================*/
        /**
         * 保存topic（修改/新增）
         * @param params
         * @param callback
         */
        service.saveTopic = function(params, callback){
            service.post('topic', params, callback);
        };
        /**
         * 查询topic
         * @param params
         * @param callback
         */
        service.getTopics = function(params, callback){
            service.get('topic', params, callback);
        };

        service.delTopic = function(params, callback){
            service.post('topic', params, callback);
        };
        /*============================================= 按照上述结论进行修改 =============================================*/
        /*============================================= 1.只需要使用post和get即可 =============================================*/
        /*============================================= 2.是否有必要封装一般情况下的callback =============================================*/
        /*============================================= 3.是否有必要将所有的请求路径保存在一个对象中 =============================================*/
        /*============================================= 4.此方案从topic开始使用 =============================================*/

        service.url = {
            topic: 'topic',
            user: 'user',
            poll: 'poll'
        };
        return service;
    });
});