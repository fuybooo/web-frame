angular.module('app').controller('TestController', function($scope, commonService, dataService, $timeout){
    "use strict";
    console.log('测试controller：TestController');
    new Kalendae(document.getElementById("test-kalendae-multi-1"), {
        months:1,
        mode:'multiple',
        viewStartDate: '2017-10-01',
        format: 'YYYY-MM-DD',
        subscribe: {
            'date-clicked': function (date) {
                console.log(date._i, this.getSelected());
            }
        }
    });
    // 隐藏不需要显示的部分
    $('.k-title').addClass('dni');
    $('.k-header').addClass('dni');
    $('.k-out-of-month').addClass('dni');


    // 获取选择的数据
    $scope.getSelected = function(){
        console.log($scope.sdcModel1);
        console.log($scope.sdcModel2);
        console.log($scope.sdcValue);
    };


    // 多选框赋值测试
    // $scope.checkbox1 = true;
    // $scope.checkbox1 = false;


    $timeout(function(){
        $scope.checkbox1 = true;
    }, 1000);
});