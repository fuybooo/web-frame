angular.module('app').controller('LandingController', function($scope, commonService){
    "use strict";
   $scope.login = commonService.tl('login');
});