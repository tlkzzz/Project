angular.module('starter.controllers', ['ionic'])
//任务
.controller('rwController',['$scope','$cordovaToast','$location',function($scope,$cordovaToast,$location) {
       $scope.onTabSelected=function(index){
           if(index==1){
              console.log(index);
           }else if(index==2){
              console.log(index);
            //  $cordovaToast.showShortCenter($location.path());
           }else if(index==3){
               console.log(index);
           }
       };


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
//我的部门
    .controller('bmCtrl',['$scope','$ionicHistory', function($scope,$ionicHistory) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }
    }])
//新增客户
 .controller('addkhCtrl',['$scope','$ionicHistory', function($scope,$ionicHistory) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }
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
//我的消息
    .controller('wdxxCtrl',['$scope','$ionicHistory', function($scope,$ionicHistory) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }
    }])
//我的设置
    .controller('wdszCtrl',['$scope','$ionicHistory', function($scope,$ionicHistory) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }
    }])
//新增任务
    .controller('addrwCtrl',['$scope','$ionicHistory', function($scope,$ionicHistory) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }
    }])
//修改密码
    .controller('xgmmCtrl',['$scope','$ionicHistory', function($scope,$ionicHistory) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }
    }])
//客户详细情况
    .controller('khxxqkCtrl',['$scope','$ionicHistory','$ionicPopup', function($scope,$ionicHistory,$ionicPopup) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        };
        $scope.delkh=function(){
            $ionicPopup.confirm({
                title: '确认',
                content: '确认删除此用户?',
                cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
                cancelType: '', // String (默认: 'button-default')。取消按钮的类型。
                okText: '确认', // String (默认: 'OK')。OK按钮的文字。
                okType: '' // String (默认: 'button-positive')。OK按钮的类型。
            }).then(function (res) {
                if (res) {
                    console.log('You are sure');
                } else {
                    console.log('You are not sure');
                }
            });
        };



    }])
//修改客户信息
    .controller('editkhCtrl',['$scope','$ionicHistory', function($scope,$ionicHistory) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }
    }])
;
