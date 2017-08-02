angular.module('app').controller('ContentController', function($scope, commonService, dataService){
    "use strict";
    console.log('测试controller：ContentController');
    $scope.queryCondition = [
        {
            key: 'fileName',
            value: '文件名称'
        },
        {
            key: 'fileType',
            value: '文件类型'
        },
        {
            key: 'fileFamily',
            value: '文件分类'
        }
    ];
});