angular.module('app')
    .constant('routers', {
        // 国际化配置文件中的title部分应与这里的数据保持一致
        'login': 'login',
        'app': 'app', // 抽象视图
        'app.dashboard': 'app.dashboard',
        'app.device': 'app.device',
        'app.deviceGroup': 'app.deviceGroup'
    })
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $logProvider, $translateProvider, lang, routers) {
        // 配置国际化
        $translateProvider.translations('lang', lang);
        $translateProvider.preferredLanguage('lang');

        $logProvider.debugEnabled(false);
        $httpProvider.interceptors.push('httpInterceptor');

        //配置路由
        $stateProvider
            .state(routers.login, {
                url: '',
                templateUrl: 'app/views/login.html',
                controller: 'LoginController'
            })
            .state(routers.app, {
                abstract: true,
                url: '/app', // url必须以"/"开头,否则在前进后退的时候会出现找不到路径的情况
                templateUrl: 'app/views/app.html'
            })
            .state(routers['app.dashboard'], {
                url: '/dashboard',
                templateUrl: 'app/views/dashboard.html',
                controller: 'DashboardController'
            })
            .state(routers['app.device'], {
                url: '/device',
                templateUrl: 'app/views/device.html',
                controller: 'DeviceController'
            })
            .state(routers['app.deviceGroup'], {
                url: '/deviceGroup',
                templateUrl: 'app/views/device-group.html',
                controller: 'DeviceGroupController'
            })
        ;
        $urlRouterProvider.otherwise('');
    });


