angular.module('app').controller('LoginController', function($rootScope,$scope, $state,$compile, commonService, dataService, Popupwin){
    // 连续登录三次错误需要输入验证码
    var wrongCount = 0;
    if(localStorage.getItem(commonService.SESSION.isValidateCodeShow) === '1'){
        wrongCount = 3;
        $scope.isValidateCodeShow = true;
    }
    // 执行登录
    $scope.runLogin = function(){
        // 验证码
        if($scope.isValidateCodeShow){
            if(!commonService.validateCode) return;
            if (commonService.validateCode.toLowerCase() !== $scope.loginInfo.validateCode.toLowerCase()) {
                commonService.alert('验证码不正确!', -1);
                return;
            }
        }
        var password = $scope.loginInfo && $scope.loginInfo.password;
        var username = $scope.loginInfo && $scope.loginInfo.username;
        dataService.get(dataService.URL.user, {
            username: username,
            password: password
        }, function(data){
            commonService.alert(data.msg, data.code);

            if(data.code === 0){
                localStorage.removeItem(commonService.SESSION.isValidateCodeShow);
                $state.go('app.dashboard');
            }else{
                if(wrongCount < 2){
                    wrongCount ++;
                }else{
                    $scope.isValidateCodeShow = true;
                    localStorage.setItem(commonService.SESSION.isValidateCodeShow, '1');
                }
            }
        });
    };
    
    $scope.keyLogin = function(e){
        if(e.which === 13){
            if($scope.login_form.$invalid) return;
            $scope.runLogin();
        }
    };
});