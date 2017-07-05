//noinspection JSFileReferences
require.config({
    baseUrl : './app/',
    waitSeconds: 0, //永不超时
    paths : {
        // 库文件
        'angular':'vendor/angular/angular',
        'angular-animate':'vendor/angular-animate/angular-animate',
        'angular-touch':'vendor/angular-touch/angular-touch',
        'angular-ui-router':'vendor/angular-ui-router/angular-ui-router',
        'angular-sanitize':'vendor/angular-sanitize/angular-sanitize',
        'angular-ui-load':'vendor/angular-ui-load/angular-ui-load',
        'angular-async-loader':'vendor/angular-async-loader/angular-async-loader',
        'jquery':'vendor/jquery/jquery',
        'bootstrap-table':'vendor/bootstrap-table/bootstrap-table',
        'bootstrap-table-locale-all':'vendor/bootstrap-table/bootstrap-table-locale-all',
        'bootstrap':'vendor/bootstrap/js/bootstrap',
        'underscore':'vendor/underscore/underscore',
        'echarts':'vendor/echarts/echarts',
        'bootstrap-datetimepicker':'vendor/bootstrap-datetimepicker/bootstrap-datetimepicker',
        'bootstrap-datetimepicker-zh-CN':'vendor/bootstrap-datetimepicker/locales/bootstrap-datetimepicker.zh-CN',
        'angular-translate': 'vendor/angular-translate/angular-translate',
        // app文件
        'app': 'scripts/configs/app',
        'router': 'scripts/configs/router',
        'commonService': 'scripts/common/common-service',
        'dataService': 'scripts/common/data-service',
        'popupwinService': 'scripts/common/popupwin-service',
        'bootstrapTableDirective': 'scripts/common/bootstrap-table-directive',
        'commonDirective': 'scripts/common/common-directive',
        'moment': 'vendor/moment/moment'
    },
    shim : {
        'angular':{
            deps:['jquery'],
            exports : 'angular'
        },
        'angular-animate':{
            deps:['angular'],
            exports:'angular-animate'
        },
        'angular-touch':{
            deps:['angular'],
            exports:'angular-touch'
        },
        'angular-ui-router':{
            deps:['angular'],
            exports:'angular-ui-router'
        },
        'angular-sanitize':{
            deps:['angular'],
            exports:'angular-sanitize'
        },
        'angular-ui-load':{
            deps:['angular'],
            exports:'angular-ui-load'
        },
        'angular-async-loader':{
            deps:['angular'],
            exports:'angular-async-loader'
        },
        'angular-translate':{
            deps:['angular']
        },
        'bootstrap':{
            deps:['jquery']
        },
        'bootstrap-table':{
            deps:['bootstrap']
        },
        'echarts':{
            deps:['jquery']
        },
        'bootstrap-table-locale-all':{
            deps:['bootstrap-table']
        },
        'app':{
            deps:[
                'angular',
                'angular-async-loader',
                'angular-ui-router',
                'angular-ui-load',
                'angular-sanitize',
                'angular-animate',
                'angular-touch'
            ]
        },
        'router': {
            deps:['app']
        },
        'commonService': {
            deps:['app']
        },
        'dataService': {
            deps:['app']
        },
        'popupwinService': {
            deps:['app']
        },
        'bootstrapTableDirective': {
            deps:['app']
        },
        'commonDirective': {
            deps:['app']
        },
        'bootstrap-datetimepicker':{
            deps:['jquery', 'bootstrap']
        },
        'bootstrap-datetimepicker-zh-CN':{
            deps:['bootstrap-datetimepicker']
        }
    }
});

require(
    [
        'angular',
        'jquery',
        'underscore',

        'angular-async-loader',
        'angular-ui-load',
        'angular-ui-router',
        'angular-animate',
        'angular-sanitize',
        'angular-touch',
        'angular-translate',
        'bootstrap',
        'echarts',
        'moment',
        // 'baidu-map',

        'bootstrap-table',
        'bootstrap-datetimepicker',

        'bootstrap-table-locale-all',
        'bootstrap-datetimepicker-zh-CN',
        'app',
        'router',
        'commonService',
        'dataService',
        'popupwinService',
        'bootstrapTableDirective',
        'commonDirective',

        'require',
        'exports',
        'module'
    ],
    function (angular) {
        angular.element(document).ready(function () {
            angular.bootstrap(document,['app']);
        });
    }
);


