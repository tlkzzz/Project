angular.module('starter.controllers', ['ionic'])
.constant('$ionicLoadingConfig', {
    template: "<ion-spinner icon='android'></ion-spinner>"
  //
})

////登陆
.controller('loginController',['$scope','$state','$ionicHistory','$ionicLoading','$cordovaProgress', function($scope,$state,$ionicHistory,$ionicLoading,$cordovaProgress) {

        $scope.login=function(){
            $ionicLoading.show();
           // $cordovaProgress.showSimpleWithLabelDetail(true, "Loading", "detail");
            setTimeout(function () {
                $ionicLoading.hide();
               // $cordovaProgress.hide();
                $state.go("tab.rw");
                }, 2000);

        }
        $scope.wjmm=function(){
            $state.go("wjmm");
        }
}])
//任务
.controller('rwController',['$scope','$cordovaToast','$location','$state',function($scope,$cordovaToast,$location,$state) {
       $scope.onTabSelected=function(index){
           if(index==1){
        $scope.rcb=function(){
            $state.go('rcb');//日程表
        }

           }else if(index==2){
              console.log(index);
            //  $cordovaToast.showShortCenter($location.path());
           }else if(index==3){
               console.log(index);
           }
       };
}])
//项目
.controller('xmController',['$scope','$state','$cordovaContacts', function($scope,$state,$cordovaContacts) {
        $scope.xzxm=function(){
            $state.go("addxm");
        };
        $scope.xmxq=function(){
            $state.go("xmxq");
        };
        $scope.lxr=function(){
//            $cordovaContacts.clone().then(function(result) {
//                // Contact saved
//            }, function(err) {
//                // Contact error
//            });
        };

}])


//客户
.controller('khController',['$scope','$state', function($scope,$state) {

        $scope.xzkh=function(){
             $state.go("addkh");
            // $state.href("login.html");
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
 .controller('addkhCtrl',['$scope','$ionicHistory','$ionicModal','$cordovaContacts', function($scope,$ionicHistory,$ionicModal,$cordovaContacts) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }


        $ionicModal.fromTemplateUrl('templates/add_lxr.html', {  //打开view所在的model
            scope: $scope,    //注入一个对象
            animation: 'slide-in-up', //动画
            backdropClickToClose:true  //点击背景是否隐藏默认true
            //第一个输入是否获取焦点
        }).then(function(modal){
            $scope.newReplieModal = modal; //显示视图
        });

        $scope.xzlxr=function(){
            //  $scope.lxr="888";
            var n='';
            $scope.change();
            $scope.newReplieModal.show();   //显示model

        }
        $scope.newReplie=function(){
            $scope.newReplieModal.hide();
           // $scope.newReplieModal.remove();
        }
//        $scope.clearinput=function(){
//              alert("6");
//           // $scope.lxr=" ";
//        }
        $scope.change=function(){
            $cordovaContacts.find({'fields':''}).then(function(data){
              //  alert(data);
                console.log(data);
                             $scope.contacts=data;
            },function(err){
                console.log("err:"+err);
            });
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
    .controller('wdszCtrl',['$scope','$ionicHistory','$ionicPopup','$state', function($scope,$ionicHistory,$ionicPopup,$state) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        };
        $scope.exti=function(){
            $ionicPopup.confirm({
                title: '确认',
                content: '是否确认退出当前用户?',
                cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
                cancelType: '', // String (默认: 'button-default')。取消按钮的类型。
                okText: '确认', // String (默认: 'OK')。OK按钮的文字。
                okType: '' // String (默认: 'button-positive')。OK按钮的类型。
            }).then(function (res) {
                if (res) {
                  //  $ionicHistory.clearCache();
                    $state.go("login");
                  //  $ionicHistory.clearHistory();

                } else {
                    //console.log('You are not sure');
                }
            });
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
//忘记密码
    .controller('wjmmCtrl',['$scope','$ionicHistory', function($scope,$ionicHistory) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }
    }])
//日程表
    .controller('rcbCtrl',['$scope','$ionicHistory', function($scope,$ionicHistory) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }
        $(".ui_timepicker").datetimepicker({
            //  showOn: "button",
            //   buttonImage: "./css/images/icon_calendar.gif",
            //   buttonImageOnly: true,
            showSecond: true,
            timeFormat: 'hh:mm:ss',
            stepHour: 1,
            stepMinute: 1,
            stepSecond: 1
        })
//         $scope.selectTime=function(dateStr){
//         alert(dateStr);
//       }
//        function selectTime (dateStr){
//            alert(dateStr);
//        }


    }])
;
