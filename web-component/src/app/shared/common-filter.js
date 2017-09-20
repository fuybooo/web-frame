angular.module('app').filter('tl', function ($translate) {
    return function(key){
        "use strict";
        return $translate.instant(key);
    };
});