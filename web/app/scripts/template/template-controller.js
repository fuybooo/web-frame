angular.module('app').controller('TemplateController', function($scope, commonService, dataService){
    "use strict";
    console.log('测试controller：TemplateController');
    // 测试国际化
    $scope.login = commonService.tl('login');
    var url = dataService.URL;
    // 测试发送静态请求
    dataService.get(url.test, function(data){
    });

});