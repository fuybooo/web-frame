angular.module('app').controller('LoginController', function($rootScope,$scope, $state,$compile, commonService, dataService, Popupwin){
    // 执行登录
    $scope.runLogin = function(){
        // 验证码
        if(!commonService.validateCode) return;
        // if (commonService.validateCode.toLowerCase() !== $scope.loginInfo.validateCode.toLowerCase()) {
        //     commonService.alert('验证码不正确!', -1);
        //     return;
        // }
        var password = $scope.loginInfo && $scope.loginInfo.password;
        var username = $scope.loginInfo && $scope.loginInfo.username;
        dataService.get(dataService.URL.user, {
            username: username,
            password: password
        }, function(data){
            console.log('登录返回值', data);
            commonService.alert(data.msg, data.code);
            $state.go('home.landing');
        });
    };
    
    $scope.keyLogin = function(e){
        if(e.which === 13){
            if($scope.login_form.$invalid) return;
            $scope.runLogin();
        }
    };
});