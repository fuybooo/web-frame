angular.module('app')
    .constant('lang', {
        // title部分应与router中的router配置项保持一致
        title: {
            'login': '登录',
            'app.dashboard': '仪表板',
            'app.device': '设备管理',
            'app.deviceGroup': '设备分组'
        },
        login: '登录',
        register: '注册'
    });