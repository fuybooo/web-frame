angular.module('app').controller('TestController', function($scope, commonService, dataService){
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

    // $scope.days = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];
    //
    // var selectedArr = [];
    // $('.sdc-wrap').find('.sdc-ul').off('click').on('click','.sdc-li', function(){
    //     var text = $(this).text();
    //     var index = selectedArr.indexOf(text);
    //     if($(this).hasClass('active')){
    //         $(this).removeClass('active');
    //         if(index !== -1){
    //             selectedArr.splice(index, 1);
    //         }
    //     }else{
    //         $(this).addClass('active');
    //         if(index === -1){
    //             selectedArr.push(text);
    //         }
    //     }
    //     $scope.$apply(function(){
    //         $scope.sdcValue = selectedArr.sort().join(',');
    //     });
    //
    // });
    // $('.sdc-wrap').find('.sdc-input').on('focus', function(){
    //     $('.sdc-wrap').find('.sdc-ul').removeClass('dn');
    // });

});