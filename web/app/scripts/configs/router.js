angular.module('app')
/**
 * 新增一个页面需要注意一下几点:
 *          nav.json
 *              1.sref
 *              2.name
 *          cn.js(国际化配置文件)
 *              3.title部分加上翻译
 *          router.js
 *              4.routers
 *              5.state
 *          新建对应的html
 *          按需求新建对应的controller 并引入到index.html中
 *          按需求新建对应的directive 并引入到index.html中
 */
    .constant('routers', {
        // 国际化配置文件中的title部分应与这里的数据保持一致
        'login': 'login',
        'app': 'app', // 抽象视图
        'app.dashboard': 'app.dashboard',
        'app.alarm': 'app.alarm',
        'app.device': 'app.device',
        'app.deviceGroup': 'app.deviceGroup',
        'app.user': 'app.user',
        'app.userGroup': 'app.userGroup',
        'app.userDept': 'app.userDept',
        'app.application': 'app.application',
        'app.applicationFamily': 'app.applicationFamily',
        'app.policy': 'app.policy',
        'app.policyDefault': 'app.policyDefault',
        'app.policyViolation': 'app.policyViolation',
        'app.push': 'app.push',
        'app.content': 'app.content',
        'app.contentFamily': 'app.contentFamily',
        'app.settingMgr': 'app.settingMgr',
        'app.settingRole': 'app.settingRole',
        'app.settingImport': 'app.settingImport',
        'app.settingProtocol': 'app.settingProtocol',
        'app.settingVersion': 'app.settingVersion',
        'app.settingData': 'app.settingData',
        'app.settingSerial': 'app.settingSerial',
        'app.settingLog': 'app.settingLog',
        'app.settingLogo': 'app.settingLogo',

        'test': 'test' // 测试页面
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
            .state(routers['app.alarm'], {
                url: '/alarm',
                templateUrl: 'app/views/alert-board.html',
                controller: 'AlarmController'
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
            .state(routers['app.user'], {
                url: '/user',
                templateUrl: 'app/views/user.html',
                controller: 'UserController'
            })
            .state(routers['app.userGroup'], {
                url: '/userGroup',
                templateUrl: 'app/views/user-group.html',
                controller: 'UserGroupController'
            })
            .state(routers['app.userDept'], {
                url: '/userDept',
                templateUrl: 'app/views/user-dept.html',
                controller: 'UserDeptController'
            })
            .state(routers['app.application'], {
                url: '/application',
                templateUrl: 'app/views/application.html',
                controller: 'ApplicationController'
            })
            .state(routers['app.applicationFamily'], {
                url: '/applicationFamily',
                templateUrl: 'app/views/application-family.html',
                controller: 'ApplicationFamilyController'
            })
            .state(routers['app.policy'], {
                url: '/policy',
                templateUrl: 'app/views/policy.html',
                controller: 'PolicyController'
            })
            .state(routers['app.policyDefault'], {
                url: '/policyDefault',
                templateUrl: 'app/views/policy-default.html',
                controller: 'PolicyDefaultController'
            })
            .state(routers['app.policyViolation'], {
                url: '/policyViolation',
                templateUrl: 'app/views/policy-violation.html',
                controller: 'PolicyViolationController'
            })
            .state(routers['app.push'], {
                url: '/push',
                templateUrl: 'app/views/push.html',
                controller: 'PushController'
            })
            .state(routers['app.content'], {
                url: '/content',
                templateUrl: 'app/views/content.html',
                controller: 'ContentController'
            })
            .state(routers['app.contentFamily'], {
                url: '/contentFamily',
                templateUrl: 'app/views/content-family.html',
                controller: 'ContentFamilyController'
            })
            .state(routers['app.settingMgr'], {
                url: '/settingMgr',
                templateUrl: 'app/views/setting-mgr.html',
                controller: 'SettingMgrController'
            })
            .state(routers['app.settingRole'], {
                url: '/settingRole',
                templateUrl: 'app/views/setting-role.html',
                controller: 'SettingRoleController'
            })
            .state(routers['app.settingImport'], {
                url: '/settingImport',
                templateUrl: 'app/views/setting-import.html',
                controller: 'SettingImportController'
            })
            .state(routers['app.settingProtocol'], {
                url: '/settingProtocol',
                templateUrl: 'app/views/setting-protocol.html',
                controller: 'SettingProtocolController'
            })
            .state(routers['app.settingVersion'], {
                url: '/settingVersion',
                templateUrl: 'app/views/setting-version.html',
                controller: 'SettingVersionController'
            })
            .state(routers['app.settingData'], {
                url: '/settingData',
                templateUrl: 'app/views/setting-data.html',
                controller: 'SettingDataController'
            })
            .state(routers['app.settingSerial'], {
                url: '/settingSerial',
                templateUrl: 'app/views/setting-serial.html',
                controller: 'SettingSerialController'
            })
            .state(routers['app.settingLog'], {
                url: '/settingLog',
                templateUrl: 'app/views/setting-log.html',
                controller: 'SettingLogController'
            })
            .state(routers['app.settingLogo'], {
                url: '/settingLogo',
                templateUrl: 'app/views/setting-logo.html',
                controller: 'SettingLogoController'
            })
            // 测试
            .state(routers.test, {
                url: '/test',
                templateUrl: 'app/views/test.html',
                controller: 'TestController'
            })
        ;
        $urlRouterProvider.otherwise('');
    });


