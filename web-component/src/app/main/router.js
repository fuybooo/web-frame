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
                templateUrl: 'src/app/login/login.html',
                controller: 'LoginController'
            })
            .state(routers.app, {
                abstract: true,
                url: '/app', // url必须以"/"开头,否则在前进后退的时候会出现找不到路径的情况
                templateUrl: 'src/app/main/app.html'
            })
            .state(routers['app.dashboard'], {
                url: '/dashboard',
                templateUrl: 'src/app/dashboard/dashboard.html',
                controller: 'DashboardController'
            })
            .state(routers['app.alarm'], {
                url: '/alarm',
                templateUrl: 'src/app/alarm/alarm.html',
                controller: 'AlarmController'
            })
            .state(routers['app.device'], {
                url: '/device',
                templateUrl: 'src/app/device/device.html',
                controller: 'DeviceController'
            })
            .state(routers['app.deviceGroup'], {
                url: '/deviceGroup',
                templateUrl: 'src/app/device/device-group.html',
                controller: 'DeviceGroupController'
            })
            .state(routers['app.user'], {
                url: '/user',
                templateUrl: 'src/app/user/user.html',
                controller: 'UserController'
            })
            .state(routers['app.userGroup'], {
                url: '/userGroup',
                templateUrl: 'src/app/user/user-group.html',
                controller: 'UserGroupController'
            })
            .state(routers['app.userDept'], {
                url: '/userDept',
                templateUrl: 'src/app/user/user-dept.html',
                controller: 'UserDeptController'
            })
            .state(routers['app.application'], {
                url: '/application',
                templateUrl: 'src/app/application/application.html',
                controller: 'ApplicationController'
            })
            .state(routers['app.applicationFamily'], {
                url: '/applicationFamily',
                templateUrl: 'src/app/application/application-family.html',
                controller: 'ApplicationFamilyController'
            })
            .state(routers['app.policy'], {
                url: '/policy',
                templateUrl: 'src/app/policy/policy.html',
                controller: 'PolicyController'
            })
            .state(routers['app.policyDefault'], {
                url: '/policyDefault',
                templateUrl: 'src/app/policy/policy-default.html',
                controller: 'PolicyDefaultController'
            })
            .state(routers['app.policyViolation'], {
                url: '/policyViolation',
                templateUrl: 'src/app/policy/policy-violation.html',
                controller: 'PolicyViolationController'
            })
            .state(routers['app.push'], {
                url: '/push',
                templateUrl: 'src/app/push/push.html',
                controller: 'PushController'
            })
            .state(routers['app.content'], {
                url: '/content',
                templateUrl: 'src/app/content/content.html',
                controller: 'ContentController'
            })
            .state(routers['app.contentFamily'], {
                url: '/contentFamily',
                templateUrl: 'src/app/content/content-family.html',
                controller: 'ContentFamilyController'
            })
            .state(routers['app.settingMgr'], {
                url: '/settingMgr',
                templateUrl: 'src/app/setting/setting-mgr.html',
                controller: 'SettingMgrController'
            })
            .state(routers['app.settingRole'], {
                url: '/settingRole',
                templateUrl: 'src/app/setting/setting-role.html',
                controller: 'SettingRoleController'
            })
            .state(routers['app.settingImport'], {
                url: '/settingImport',
                templateUrl: 'src/app/setting/setting-import.html',
                controller: 'SettingImportController'
            })
            .state(routers['app.settingProtocol'], {
                url: '/settingProtocol',
                templateUrl: 'src/app/setting/setting-protocol.html',
                controller: 'SettingProtocolController'
            })
            .state(routers['app.settingVersion'], {
                url: '/settingVersion',
                templateUrl: 'src/app/setting/setting-version.html',
                controller: 'SettingVersionController'
            })
            .state(routers['app.settingData'], {
                url: '/settingData',
                templateUrl: 'src/app/setting/setting-data.html',
                controller: 'SettingDataController'
            })
            .state(routers['app.settingSerial'], {
                url: '/settingSerial',
                templateUrl: 'src/app/setting/setting-serial.html',
                controller: 'SettingSerialController'
            })
            .state(routers['app.settingLog'], {
                url: '/settingLog',
                templateUrl: 'src/app/setting/setting-log.html',
                controller: 'SettingLogController'
            })
            .state(routers['app.settingLogo'], {
                url: '/settingLogo',
                templateUrl: 'src/app/setting/setting-logo.html',
                controller: 'SettingLogoController'
            })
        ;
        $urlRouterProvider.otherwise('');
    });


