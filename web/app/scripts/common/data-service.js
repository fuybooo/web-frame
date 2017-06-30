angular.module('app').factory('dataService', function ($http, $injector, baseRequestUrl, baseStaticUrl, webSocketUrl) {
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
        promise.success(function (res) {
            if (method !== 'GET') {
                if (res.msg) {
                    commonService.alert(res.msg, res.code);
                }
            }
            if (cb_s) {
                cb_s(res);
            }
        }).error(function (res) {
            commonService.alert(res.msg || '发生严重错误！', res.code);
            if (cb_e) {
                cb_e(res);
            }
        });
    };
    /**
     * get 方式
     */
    service.get = function () {
        request('GET', arguments);
    };
    /**
     * post方式
     */
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
     * 所有请求路径
     */
    service.URL = {};
    return service;

});