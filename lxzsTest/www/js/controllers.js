angular.module('starter.controllers', [])
//任务
.controller('rwController',['$scope', function($scope) {

}])
//项目
.controller('xmController',['$scope','$state', function($scope,$state) {
        $scope.xzxm=function(){
            $state.go("addxm");
        };
        $scope.xmxq=function(){
            $state.go("xmxq");
        }

}])


//客户
.controller('khController',['$scope','$state', function($scope,$state) {

        $scope.xzkh=function(){
             $state.go("addkh");
        }

}])
//我的
.controller('wdController',['$scope', function($scope) {

}])
//客户信息
 .controller('khxxtCtrl',['$scope', function($scope) {

}])

//待完成,已过期,完成
.controller('DashCtrl'['$scope', function($scope) {


}])
//我的同事
.controller('wdtsCtrl',['$scope','$ionicHistory', function($scope,$ionicHistory) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }
    }])
//我的同事
    .controller('bmCtrl',['$scope', function($scope) {

    }])
//新增客户
 .controller('addkhCtrl',['$scope', function($scope) {

    }])
//新增项目
    .controller('addxmCtrl',['$scope','$ionicHistory', function($scope,$ionicHistory) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }
    }])
//项目详情
    .controller('xmxqCtrl',['$scope','$ionicHistory', function($scope,$ionicHistory) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }
    }])
;
