angular.module('starter.controllers', ['ionic'])
.constant('$ionicLoadingConfig', {
    template: "<ion-spinner icon='android'></ion-spinner>"
  //
})
.config([ '$httpProvider', function($httpProvider) {
        $httpProvider.defaults.headers.post["Content-Type"] = $httpProvider.defaults.headers.put["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8;";
       // $httpProvider.interceptors.push($httpProvider.defaults.headers.post["Content-Type"] = $httpProvider.defaults.headers.put["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8;");
        $httpProvider.interceptors.push('httpInterceptor');
} ])

////登陆
.controller('loginController',['$scope',"$http",'sessionService','loginServer','$state','$ionicHistory','$ionicLoading','$cordovaProgress','localStorageServices','$cordovaToast','$cordovaDevice', function($scope,$http,sessionService,loginServer,$state,$ionicHistory,$ionicLoading,$cordovaProgress,localStorageServices,$cordovaToast,$cordovaDevice) {
       $scope.pp={};
       $scope.pp.user=localStorageServices.getUser("user");
       $scope.pp.pass=localStorageServices.getPass("pass");
       if(localStorageServices.getCheck("check")==null ||localStorageServices.getCheck("check")==false){
           $scope.pp.check=false;
       }else{
           $scope.pp.check=true;
       }

        $scope.login=function(){//登陆
            var us=$scope.pp.user;
            var ps=$scope.pp.pass;
            var ck=$scope.pp.check;
            if(us==null){
                $cordovaToast.showShortCenter('请输入用户名');
                return false;
            }
            if(ps==null){
                $cordovaToast.showShortCenter('请输入密码');
                return  false;
            }

            //$ionicLoading.show();

            //登陆方法
            var url=API.LOGIN;//获取url
           // var hardIds=$cordovaDevice.getVersion();//系统版本号
           // var systems=$cordovaDevice.getPlatform();//操作系统
            var phoneTypes=1;//手机类型
            var hardIds="yyx";//系统版本号
            var systems="Android";//操作系统
            var params={
                    "hardId":hardIds,
                    "system":systems,
                    "phoneType":phoneTypes,
                    "passWord":ps,
                    "loginName":us
                }
            // console.log(params);
//            $http({method: "POST",
//                url: url,
//                headers: {'Content-type': 'application/x-www-form-urlencoded'},
//                data: params}).success(function(data, status) {
//                alert(data.resultCode);
//                console.log(data);
//            // success handle code
//            }).error(function(data, status) {
//                alert(status);
//            });


            loginServer.login(url,params).success(function(data,status,headers,config) {
               // $cordovaProgress.hide();
                if(data.resultCode==1) {
                   // alert(data.resultInfo);
                    var seion={
                        "sessionId" : data.sessionId,//会话id
                        "userId" : data.userObject.userId,//用户id
                        "userName" : data.userObject.userName,//用户名称
                        "sex" : data.userObject.sex,//用户性别
                        "phoneType" : phoneTypes,//手机类型
                        "hardId" : hardIds,//系统版本号
                        "system" : systems//操作系统
                    }
                  sessionService.addsession(seion);
                 if(ck==true){
                 localStorageServices.addMm(us,ps,ck); //保存密码
                 }else{
                 localStorageServices.delAll();
                 }
                    $state.go("tab.rw");//跳转首页
                 }else{
                    alert(data.resultCode);
                 }
                }).error(function(data,status){
               // $cordovaProgress.hide();
                   console.log(data);
                   alert(status);
                });



           // $cordovaProgress.showSimpleWithLabelDetail(true, "Loading", "detail");
//            setTimeout(function () {
//                $ionicLoading.hide();
//                if(ck==true){
//                 localStorageServices.addMm(us,ps,ck); //保存密码
//                }else{
//                 localStorageServices.delAll();
//                }
//               // $cordovaProgress.hide();
//                $state.go("tab.rw");
//                }, 2000);

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
.controller('khController',['$scope','$state','khlistServer', function($scope,$state,khlistServer) {
        //添加客户
        $scope.xzkh=function(){
             $state.go("addkh");
            // $state.href("login.html");
        }

        var custName=null; //客户名称或者手机号码
        var currPage=1;  //当前页数
        var pageSize=10; //每页条数

        var url=API.KHLIST+PINGJ.hardId+'/'+USER.sessionId+'/'+custName+'/'+currPage+'/'+pageSize;//获取url
       //客户列表查询
        khlistServer.khlist(url).success(function(data,status,headers,config){
            if(data.resultCode==1){
              console.log(data);
            }else{
              console.log(data);
              alert(data.resultCode);
            }
        }).error(function(data,status,headers,config){
            console.log(data);
            alert(status);
        });
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
        $scope.pp={};
        $scope.pp.yzf=false;
        $scope.pp.sjdw=false;
        $scope.pp.zbf=false;
        //$scope.visible = !$scope.visible;
        $scope.showyzf=function(){
          var t=$scope.pp.yzf;
            if(t==true){
                $scope.pp.yzf=false;
            }else{
                $scope.pp.yzf=true;
            }
        }
        $scope.showsjdw=function(){
            var t=$scope.pp.sjdw;
            if(t==true){
                $scope.pp.sjdw=false;
            }else{
                $scope.pp.sjdw=true;
            }
        }
        $scope.zbfshow=function(){
            var t=$scope.pp.zbf;
            if(t==true){
                $scope.pp.zbf=false;
            }else{
                $scope.pp.zbf=true;
            }
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
        $scope.tlk={rwms:'',wcsj:'',glxm:'',jzsj:''};

        $scope.reqister=function(u){
           console.log(u);
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
    .controller('wjmmCtrl',['$scope','$ionicHistory','$interval','$cordovaToast', function($scope,$ionicHistory,$interval,$cordovaToast) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }
       $scope.test={};
       $scope.ss=false;
       $scope.wjmmclass="button button-block button-positive";
       $scope.wjmm="获取验证码";

        $scope.hqyzm=function(){//点击获取验证码
            // alert(angular.element(document.querySelector('#tel')).val());//内置对象获取
            var tel=$scope.test.tels;
            if(tel==undefined){
                $cordovaToast.showShortCenter('请输入手机号码');
                return  false;
            }

           $scope.ss=true;
           $scope.wjmmclass="button button-block button-calm";
            $scope.n=30;
            $scope.wjmm= $scope.n+'秒';
            var time=$interval(function(){
                $scope.n--;
                $scope.wjmm= $scope.n+'秒';
                if($scope.n==0){
                    $scope.ss=false;
                    $scope.wjmmclass="button button-block button-positive";
                    $scope.wjmm="重新获取验证码";
                    $interval.cancel(time);
                }
            },1000);
        }
    }])
//日程表
    .controller('rcbCtrl',['$scope','$ionicHistory','$filter', function($scope,$ionicHistory,$filter) {
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
            stepSecond: 1,
            onSelect: function(dateText, inst) {
                   alert(dateText);
                   }
        })
            var currentDate = jQuery( ".ui_timepicker" ).datepicker( "getDate" );
           // currentDate=new Date(currentDate);currentDate.valueOf()
            //alert(currentDate);
        alert($filter("date")(currentDate.valueOf(), "yyyy-MM-dd hh:mm:ss"));

    }])
;
