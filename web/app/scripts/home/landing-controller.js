angular.module('app').controller('LandingController', function($scope, commonService, dataService, $http){
    "use strict";
    // 测试国际化
    $scope.login = commonService.tl('login');
    var url = dataService.URL;
    // 测试发送静态请求
    dataService.get(url.test, function(data){
        console.log('发送静态请求：', data);
    });
    // 测试bootstrap-table的使用
    
});