angular.module('app').controller('ContentController', function($scope, commonService, dataService){
    "use strict";
    console.log('测试controller：ContentController');
    $scope.queryCondition = [
        {
            key: 'fileName',
            value: '文件名称'
        },
        {
            key: 'category',
            value: '分类'
        }
    ];
    $scope.filePath = '全部文件';
});