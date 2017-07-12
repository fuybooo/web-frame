angular.module('app')
    .constant('lang', {
        // title部分应与router中的router配置项保持一致
        // title and nav start
        'login': '登录',
        'app.dashboard': '仪表板',
        'app.alertBoard': '告警板',
        'app.device': '设备管理',
        'app.deviceGroup': '设备分组',
        'app._user': '用户管理', // 父级目录
        'app.user': '用户',
        'app.userGroup': '用户组',
        'app.userDept': '部门',
        'app._application': '应用管理', // 父级目录
        'app.application': '应用列表',
        'app.applicationFamily': '应用分类',
        'app._policy': '策略管理', // 父级目录
        'app.policy': '策略列表',
        'app.policyDefault': '默认策略',
        'app.policyViolation': '违规策略',
        'app.push': '推送管理',
        'app._content': '内容管理', // 父级目录
        'app.content': '文件列表',
        'app.contentFamily': '文件分类',
        'app._setting': '设置', // 父级目录
        'app.settingMgr': '管理员',
        'app.settingRole': '角色',
        'app.settingImport': 'LDAP/AD数据导入',
        'app.settingProtocol': '用户协议',
        'app.settingVersion': 'EMM客户端版本管理',
        'app.settingData': '数据、锁屏和离线等配置',
        'app.settingSerial': '序列号版本信息',
        'app.settingLog': '日志',
        'app.settingLogo': 'LOGO'
        // title and nav end
    });