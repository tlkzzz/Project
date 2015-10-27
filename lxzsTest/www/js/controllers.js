angular.module('starter.controllers', ['ionic','starter.filter'])
.constant('$ionicLoadingConfig', {
    template: "<ion-spinner icon='spiral'></ion-spinner>"
  //
})
.config([ '$httpProvider', function($httpProvider) {
        $httpProvider.defaults.headers.post["Content-Type"] = $httpProvider.defaults.headers.put["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8;";
       // $httpProvider.interceptors.push($httpProvider.defaults.headers.post["Content-Type"] = $httpProvider.defaults.headers.put["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8;");
        $httpProvider.interceptors.push('httpInterceptor');
} ])



////登陆
.controller('loginController',['$scope',"$http",'sessionService','postServer','$state','$ionicHistory','$ionicLoading','$cordovaProgress','localStorageServices','$cordovaToast','$cordovaDevice', function($scope,$http,sessionService,postServer,$state,$ionicHistory,$ionicLoading,$cordovaProgress,localStorageServices,$cordovaToast,$cordovaDevice) {


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

            $ionicLoading.show();

            //登陆方法
            var url=API.LOGIN;//获取url
           var hardIds=$cordovaDevice.getUUID();//系统版本号
           var systems=$cordovaDevice.getPlatform();//操作系统
              var phoneTypes='';
              if(systems == 'iOS'){
                phoneTypes=2;//手机类型
             }else if(systems =='Android'){
                  phoneTypes=1;
              }else{
                  phoneTypes=3;
              }
//            var phoneTypes=1;//手机类型
//            var hardIds="yyx";//系统版本号
//            var systems="android";//操作系统

//            var b = new Base64();
//            var str = b.encode(ps);
            var hash = hex_md5(ps);
            var params={
                    "hardId":hardIds,
                    "system":systems,
                    "phoneType":phoneTypes,
                    "passWord":hash, //64再md5加密
                    "loginName":us
                }

            params=angular.fromJson(params);
            console.log(params);
            postServer.post(url,params).success(function(data,status,headers,config) {
                $ionicLoading.hide();
                console.log(data);
                if(data.resultCode==1) {
                  console.log(data);
                    var seion={
                        "sessionId" : data.sessionId,//会话id
                        "userId" : data.userObject.userId,//用户id
                        "userName" : data.userObject.userName,//用户名称
                        "sex" : data.userObject.sex,//用户性别
                        "phoneType" : phoneTypes,//手机类型
                        "hardId" : hardIds,//系统版本号
                        "system" : systems,//操作系统
                        "areaCode": data.userObject.areaCode,//区域ID
                        "departId":data.userObject.departId  //部门ID
                    }


                   sessionService.addsession(seion);
                 if(ck==true){
                 localStorageServices.addMm(us,ps,ck); //保存密码
                 }else{
                 localStorageServices.delAll();
                 }
                    $state.go("tab.rw");//跳转首页
                 }else{
                    $cordovaToast.showShortCenter(data.resultInfo);
                 }
                }).error(function(data,status){
                $ionicLoading.hide();
                $cordovaToast.showShortCenter('连接服务器失败啦!');
                });




        }
        $scope.wjmm=function(){
            $state.go("wjmm");
        }
}])
//项目
.controller('rwController',['$scope','postServer','$ionicPopup','$timeout','$cordovaToast','getServer','sessionService','$location','$state',function($scope,postServer,$ionicPopup,$timeout,$cordovaToast,getServer,sessionService,$location,$state) {
        $scope.rcb=function(){
            $state.go('rcb');//日程表
        }

//
        $scope.xzxm=function(){
            $state.go("addxm");
        };
        $scope.xmxq=function(u,s,y){
            console.log(y);
            if(s==1){
                $state.go("xmbh",{ids:u,idy:y});
            }else{
                $state.go("xmxq",{ids:u,idy:y,idz:s});
            }

        };

        $scope.shwomor=true;


        var currPage=0;  //当前页数
        var stsr='';
        stsr=$scope.xm;
        if(stsr==undefined){
            stsr=null;
        }else if(stsr==''){
            stsr=null;
        }
        var pageSize=10; //每页条数
        var sion=sessionService.getsession();//获取缓存数据
        currPage=currPage+1;
        var url=API.XMLIST+sion.hardId+'/'+sion.sessionId+'/'+sion.userId+'/'+stsr+'/'+sion.areaCode+'/'+currPage+'/'+pageSize;//获取url
        getServer.get(url).success(function(data,status,headers,config){
            console.log(data);
            if(data.resultCode==1){
                $scope.xmlist=data.projrctList;
                if(data.projrctList.length<10){
                    $scope.shwomor=false;
                }
            }else{
                $cordovaToast.showShortCenter(data.resultInfo);
            }
        }).error(function(data,status,headers,config){
            console.log(data);
            $cordovaToast.showShortCenter('连接服务器失败啦!');
        });

        $scope.loadMore=function(){
            $timeout( function() {
                stsr=$scope.xm;
                if(stsr==undefined){
                    stsr=null;
                }else if(stsr==''){
                    stsr=null;
                }
                currPage=currPage+1;
                var url=API.XMLIST+sion.hardId+'/'+sion.sessionId+'/'+sion.userId+'/'+stsr+'/'+sion.areaCode+'/'+currPage+'/'+pageSize;//获取url
                //客户列表查询
                getServer.get(url).success(function(data,status,headers,config){
                    if(data.resultCode==1){
                        for(var i=0;i<data.projrctList.length;i++){
                            $scope.xmlist.push(data.projrctList[i]);
                        }
                        if(data.taskList==0){
                            $scope.shwomor=false;
                        }
                        console.log(data);
                    }else{
                        $scope.shwomor=false;  //隐藏加载动画
                        $scope.$broadcast('scroll.infiniteScrollComplete');//关闭加载事件
                    }
                }).error(function(data,status,headers,config){
                    $scope.shwomor=false;  //隐藏加载动画
                    $cordovaToast.showShortCenter('连接服务器失败啦!');
                });
                $scope.$broadcast('scroll.infiniteScrollComplete');

            }, 1000);
        }
        $scope.clearSearch=function(){
            $scope.shwomor=true;
            currPage=0;  //当前页数
            currPage=currPage+1;
            stsr=$scope.xm;
            if(stsr==undefined){
                stsr=null;
            }else if(stsr==''){
                stsr=null;
            }
            var url=API.XMLIST+sion.hardId+'/'+sion.sessionId+'/'+sion.userId+'/'+stsr+'/'+sion.areaCode+'/'+currPage+'/'+pageSize;//获取url
            getServer.get(url).success(function(data,status,headers,config){
                console.log(data);
                if(data.resultCode==1){
                    $scope.xmlist=data.projrctList;
                    if(data.projrctList.length<10){
                        $scope.shwomor=false;
                    }
                }else{
                    $cordovaToast.showShortCenter(data.resultInfo);
                }
            }).error(function(data,status,headers,config){
                console.log(data);
                $cordovaToast.showShortCenter('连接服务器失败啦!');
            });
        }
    }])
//任务
.controller('xmController',['$scope','$cordovaToast','$state','$timeout','sessionService','getServer','$cordovaContacts', function($scope,$cordovaToast,$state,$timeout,sessionService,getServer,$cordovaContacts) {
        $scope.xzxm=function(){
            $state.go("addxm");
        };
        $scope.xmxq=function(u){
            $state.go("rwlistxq",{ids:u});
        };

        $scope.shwomor=true;


        var currPage=0;  //当前页数
        var stsr='';
        stsr=$scope.xm;
        if(stsr==undefined){
            stsr=null;
        }else if(stsr==''){
            stsr=null;
        }
        var pageSize=10; //每页条数
        var sion=sessionService.getsession();//获取缓存数据
        currPage=currPage+1;
        var url=API.RWLISTXQ+sion.hardId+'/'+sion.sessionId+'/'+sion.userId+'/'+stsr+'/'+currPage+'/'+pageSize;//获取url
        console.log(url);
        getServer.get(url).success(function(data,status,headers,config){
            console.log(data);
            if(data.resultCode==1){
                $scope.rwlist=data.taskList;
                if(data.taskList.length<10){
                    $scope.shwomor=false;
                }
            }else{
                $cordovaToast.showShortCenter(data.resultInfo);
            }
        }).error(function(data,status,headers,config){
            $cordovaToast.showShortCenter('连接服务器失败啦!');
        });
        //查询项目名称列表下啦
        var urls=API.RWLIST+sion.hardId+'/'+sion.sessionId+'/'+sion.userId;//获取url
        console.log(urls);
        getServer.get(urls).success(function(data,status,headers,config){
            console.log(data);
            if(data.resultCode==1){
                $scope.ussssr=data.projrctList;
            }else{
                //$cordovaToast.showShortCenter(data.resultInfo);
            }
        }).error(function(data,status,headers,config){
            $cordovaToast.showShortCenter('连接服务器失败啦!');
        });
        $scope.loadMore=function(){
            $timeout( function() {
                stsr=$scope.xm;
                if(stsr==undefined){
                    stsr=null;
                }else if(stsr==''){
                    stsr=null;
                }
                currPage=currPage+1;
                var url=API.RWLISTXQ+sion.hardId+'/'+sion.sessionId+'/'+sion.userId+'/'+stsr+'/'+currPage+'/'+pageSize;//获取url
                //客户列表查询
                getServer.get(url).success(function(data,status,headers,config){
                    if(data.resultCode==1){
                        for(var i=0;i<data.taskList.length;i++){
                            $scope.rwlist.push(data.taskList[i]);
                        }
                        if(data.taskList==0){
                            $scope.shwomor=false;
                        }
                        console.log(data);
                    }else{
                        $scope.shwomor=false;  //隐藏加载动画
                        $scope.$broadcast('scroll.infiniteScrollComplete');//关闭加载事件
                    }
                }).error(function(data,status,headers,config){
                    $scope.shwomor=false;  //隐藏加载动画
                    $cordovaToast.showShortCenter('连接服务器失败啦!');
                });
                $scope.$broadcast('scroll.infiniteScrollComplete');

            }, 1000);
        }
        $scope.clearSearch=function(x){
            $scope.shwomor=true;
            currPage=0;  //当前页数
            currPage=currPage+1;
            stsr=x;
            if(stsr==undefined){
                stsr=null;
            }else if(stsr==''){
                stsr=null;
            }
            var url=API.RWLISTXQ+sion.hardId+'/'+sion.sessionId+'/'+sion.userId+'/'+stsr+'/'+currPage+'/'+pageSize;//获取url
            getServer.get(url).success(function(data,status,headers,config){
                console.log(data);
                if(data.resultCode==1){
                    $scope.rwlist=data.taskList;
                    if(data.taskList.length<10){
                        $scope.shwomor=false;
                    }
                }else{
                    $cordovaToast.showShortCenter(data.resultInfo);
                }
            }).error(function(data,status,headers,config){
                console.log(data);
                $cordovaToast.showShortCenter('连接服务器失败啦!');
            });
        }


}])
//任务详情
.controller('rwlistCtrl',['$scope','$ionicHistory','postServer','$ionicPopup','$stateParams','$cordovaToast','$state','$timeout','sessionService','getServer','$cordovaContacts', function($scope,$ionicHistory,postServer,$ionicPopup,$stateParams,$cordovaToast,$state,$timeout,sessionService,getServer,$cordovaContacts) {
        var ids=$stateParams.ids;
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }

        var sion=sessionService.getsession();//获取缓存数据
        var url=API.RWXQ+sion.hardId+'/'+sion.sessionId+'/'+ids+'/'+sion.userId;//获取url
        getServer.get(url).success(function(data,status,headers,config){
            console.log(data);
            if(data.resultCode==1){
               $scope.tlk=data.task;
            }else{
                $cordovaToast.showShortCenter(data.resultInfo);
            }
        }).error(function(data,status,headers,config){
            $cordovaToast.showShortCenter('连接服务器失败啦!');
        });

        //删除
        $scope.delrw=function(y){
            $ionicPopup.confirm({
                title: '确认',
                content: '是否删除任务?',
                cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
                cancelType: '', // String (默认: 'button-default')。取消按钮的类型。
                okText: '确认', // String (默认: 'OK')。OK按钮的文字。
                okType: '' // String (默认: 'button-positive')。OK按钮的类型。
            }).then(function (res) {
                if (res) {
                  var urls=API.WCRW;
                  var ps={'hardId':sion.hardId,'sessionId':sion.sessionId,'taskId':y};
                    ps=angular.fromJson(ps);
                    postServer.post(urls,ps).success(function(data,status,headers,config){
                        console.log(data);
                        if(data.resultCode==1){
                            $ionicHistory.goBack();
                            $cordovaToast.showShortCenter(data.resultInfo);
                        }else{
                            $cordovaToast.showShortCenter(data.resultInfo);
                        }
                    }).error(function(data,status,headers,config){
                        console.log(data);
                        $cordovaToast.showShortCenter('连接服务器失败啦!');
                    });
                } else {
                    //console.log('You are not sure');
                }
            });
        }
        }])
//任务修改
.controller('rweditCtrl',function($scope,$filter,postServer,$ionicHistory,$stateParams,$cordovaToast,sessionService,$cordovaContacts) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }
        var stlk=angular.fromJson($stateParams.ids);
        $scope.tlk=stlk;
        //$scope.tlk.completeDate=new Date();
        var  dates = $filter('date')($scope.tlk.completeDate, "yyyy-MM-dd")
        var d = new Date(dates);
        $scope.tlk.completeDate=d;
       var sion=sessionService.getsession();//获取缓存数据
       var tlks={
            'hardId':sion.hardId,
            'sessionId':sion.sessionId,
            'userId':sion.userId
       }
      var tpp=angular.fromJson(tlks);
        $scope.reqister=function(u){
            var obj=angular.extend({}, u, tpp);//合并两个对象
            var  dates = $filter('date')(obj.completeDate, "yyyy-MM-dd");
            obj.completeDate=dates;
            var urls=API.XGTJRW;//获取url
            console.log(obj);
            postServer.post(urls,obj).success(function(data,status,headers,config){
                console.log(data);
                if(data.resultCode==1){
                    $ionicHistory.goBack();
                    $cordovaToast.showShortCenter(data.resultInfo);
                }else{
                    $cordovaToast.showShortCenter(data.resultInfo);
                }
            }).error(function(data,status,headers,config){
                $cordovaToast.showShortCenter('连接服务器失败啦!');
            });
        }
    })
//客户
.controller('khController',['$scope','$cordovaToast','$cordovaSms','$ionicPopup','$timeout','sessionService','$state','getServer', function($scope,$cordovaToast,$cordovaSms,$ionicPopup,$timeout,sessionService,$state,getServer) {
        //添加客户
        $scope.xzkh=function(){
             $state.go("addkh");
        }
        $scope.shwomor=true;
        var currPage=0;  //当前页数
        var stsr='';
            stsr=$scope.khry;
        if(stsr==undefined){
            stsr=null;
        }else if(stsr==''){
            stsr=null;
        }

        var pageSize=10; //每页条数
        var sion=sessionService.getsession();//获取缓存数据

            currPage=currPage+1;

        var url=API.KHLIST+sion.hardId+'/'+sion.sessionId+'/'+stsr+'/'+sion.areaCode+'/'+sion.userId+'/'+currPage+'/'+pageSize;//获取url
       //客户列表查询
        getServer.get(url).success(function(data,status,headers,config){
            console.log(data);
            if(data.resultCode==1){

                $scope.khlist=data.custList;
                if(data.custList.length<10){
                    $scope.shwomor=false;
                }
            }else{
             //   console.log(data.resultInfo);
                $cordovaToast.showShortCenter(data.resultInfo);
            }
        }).error(function(data,status,headers,config){
            $cordovaToast.showShortCenter('连接服务器失败啦!');
        });
        $scope.loadMore=function(){
            $timeout( function() {
                currPage=currPage+1;
                  stsr=$scope.khry;
                if(stsr==undefined){
                    stsr=null;
                }else if(stsr==''){
                    stsr=null;
                }
               // console.log(currPage+"88");
                var url=API.KHLIST+sion.hardId+'/'+sion.sessionId+'/'+stsr+'/'+sion.areaCode+'/'+sion.userId+'/'+currPage+'/'+pageSize;//获取url
                //客户列表查询
                getServer.get(url).success(function(data,status,headers,config){
                    if(data.resultCode==1){
                        for(var i=0;i<data.custList.length;i++){
                            $scope.khlist.push(data.custList[i]);
                        }
                        if(data.custList==0){
                          $scope.shwomor=false;
                        }
                        console.log(data);
                    }else{
                        $scope.shwomor=false;  //隐藏加载动画
                        $scope.$broadcast('scroll.infiniteScrollComplete');//关闭加载事件
                    }
                }).error(function(data,status,headers,config){
                    $cordovaToast.showShortCenter('连接服务器失败啦!');
                });
                $scope.$broadcast('scroll.infiniteScrollComplete');

            }, 1000);
        }

        $scope.clearSearch=function(){
            $scope.shwomor=true;
            currPage=0;  //当前页数
            currPage=currPage+1;
               stsr=$scope.khry;
            if(stsr==undefined){
                stsr=null;
            }else if(stsr==''){
                stsr=null;
            }
                var urls=API.KHLIST+sion.hardId+'/'+sion.sessionId+'/'+stsr+'/'+sion.areaCode+'/'+sion.userId+'/'+currPage+'/'+pageSize;//获取url
                //客户列表查询
                getServer.get(urls).success(function(data,status,headers,config){
                    if(data.resultCode==1){
                          console.log(data);
                        $scope.khlist=data.custList;
                        if(data.custList.length<10){
                            $scope.shwomor=false;
                        }
                    }else{
                        $cordovaToast.showShortCenter(data.resultInfo);
                    }
                }).error(function(data,status,headers,config){
                    $cordovaToast.showShortCenter('连接服务器失败啦!');
                });

        }

        //发送短信
        $scope.sendDx=function(y){
                 $scope.date = {
                 };
            var options = {
                replaceLineBreaks: false, // true to replace \n by a new line, false by default
                android: {
                    intent: 'INTENT'  // send SMS with the native android SMS messaging
            //intent: ‘‘ // send SMS without open any other app
        }
    };
            $cordovaSms
                .send(y, '', options)
                .then(function() {

                }, function(error) {
                   alert(error);
                });

        }

}])
//我的
.controller('wdController',['$scope', function($scope) {

}])
//客户信息
 .controller('khxxtCtrl',['$scope', function($scope) {



}])


//我的同事
.controller('wdtsCtrl',['$scope','$cordovaToast','$state','$ionicHistory','sessionService','getServer', function($scope,$cordovaToast,$state,$ionicHistory,sessionService,getServer) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }
        var sion=sessionService.getsession();//获取缓存数据
        var url=API.BMLIST+sion.hardId+"/"+sion.sessionId+'/'+sion.departId+'/'+sion.areaCode;
        getServer.get(url).success(function(data,status,headers,config){
            console.log(data);
            if(data.resultCode==1){
                $scope.list=data.departList;
                console.log(data);
            }else {
                $cordovaToast.showShortCenter(data.resultInfo);
            }
        }).error(function(data,status,headers,config){
            $cordovaToast.showShortCenter('连接服务器失败啦!');
        });

        $scope.opens=function(x,y){
            if(x!=0){
                $state.go('bm',{ids:y});
            }
        }
    }])
//同事
    .controller('bmCtrl',['$scope','$cordovaToast','$cordovaSms','$ionicHistory','getServer','sessionService','$stateParams', function($scope,$cordovaToast,$cordovaSms,$ionicHistory,getServer,sessionService,$stateParams) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }

        var ids=$stateParams.ids;
        var sion=sessionService.getsession();//获取缓存数据
        var url=API.BMRYLIST+sion.hardId+"/"+sion.sessionId+"/"+ids;
        getServer.get(url).success(function(data,status,headers,config){
            if(data.resultCode==1){
                $scope.bmry=data.departUserList;
            }else{
                $cordovaToast.showShortCenter(data.resultInfo);
            }
        }).error(function(data,status,headers,config){
            $cordovaToast.showShortCenter('连接服务器失败啦!');
        });

        //发送短信
        $scope.sendDx=function(y){
            $scope.date = {
            };
            var options = {
                replaceLineBreaks: false, // true to replace \n by a new line, false by default
                android: {
                    intent: 'INTENT'  // send SMS with the native android SMS messaging
                    //intent: ‘‘ // send SMS without open any other app
                }
            };
            $cordovaSms
                .send(y, '', options)
                .then(function() {

                }, function(error) {
                    $cordovaToast.showShortCenter(error);
                });

        }


    }])
//新增客户
 .controller('addkhCtrl',['$scope','getServer','$cordovaToast','postServer','sessionService','$ionicHistory','$ionicModal','$cordovaContacts', function($scope,getServer,$cordovaToast,postServer,sessionService,$ionicHistory,$ionicModal,$cordovaContacts) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }
        var sion=sessionService.getsession();//获取缓存数据

        var  urls=API.ZPRWLIST+sion.hardId+'/'+sion.sessionId+'/'+sion.userId;
        getServer.get(urls).success(function(data,status,headers,config){
            if(data.resultCode==1){
                console.log(data);
                $scope.users=data.projrctList;
            }else{
                //$cordovaToast.showShortCenter(data.resultInfo);

            }
        }).error(function(data,status,headers,config){
            $cordovaToast.showShortCenter('连接服务器失败啦!');
        });

        $scope.kh={
            'hardId':sion.hardId,
            'sessionId':sion.sessionId,
            'customerName':'',
            'customerPhone':'',
            'unitName':'',
            'customerJob':'',
            'unitAddress':'',
            'userId':sion.userId,
            'areaCode':sion.areaCode,
            'projectAreaCode':''
        }

        $scope.reqister=function(kh){
            var url=API.ADDKH;
            console.log(kh);
            postServer.post(url,kh).success(function(data,status,headers,config){
            if(data.resultCode==1){
                console.log(data.resultInfo);
                $ionicHistory.goBack();
                $cordovaToast.showShortCenter(data.resultInfo);
            }else{
                $cordovaToast.showShortCenter(data.resultInfo);
            }
            }).error(function(data,status,headers,config){
                $cordovaToast.showShortCenter('连接服务器失败啦!');
            });

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
//            var n='';
            $scope.change();
            $scope.newReplieModal.show();   //显示model

        }
        var sj=null;
        var name=null;
        $scope.addsj=function(x,y){
            sj=y;
            name=x;
        }
        $scope.newReplie=function(){
            if(sj!=null){
            $scope.kh.customerName=name;
            $scope.kh.customerPhone=sj;
            $scope.newReplieModal.hide();
                sj=null;
                name=null;
            }else{
                $cordovaToast.showShortCenter("请选择联系人");
            }
        }
        $scope.newReplieModals=function(){
           sj=null;
           name=null;
            $scope.newReplieModal.hide();
       }

        $scope.change=function(){
            $cordovaContacts.find({'fields':''}).then(function(data){
              //  alert(data);
                ///console.log(data);
                //  $scope.contacts=data;
                var list=[];
                for(var i=0;i<data.length;i++){
                 //  var k=data[i].displayName+"--"+data[i].phoneNumbers[0].value;
                    var k={
                        'displayName':data[i].displayName,
                        'phoneNumbers':data[i].phoneNumbers[0].value
                    }

                    list.push(k);
                }
                $scope.contacts=list;
            },function(err){
                console.log("err:"+err);
            });
        }
    }])
//新增项目
    .controller('addxmCtrl',['$scope','$ionicPopup','getServer','$ionicModal','$ionicHistory','postServer','sessionService','$cordovaToast', function($scope,$ionicPopup,getServer,$ionicModal,$ionicHistory,postServer,sessionService,$cordovaToast) {
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
        var sion=sessionService.getsession();//获取缓存数据
        //选择省市
        var urlss=API.ADDXMS+sion.hardId+'/'+sion.sessionId;
        getServer.get(urlss).success(function(data,status,headers,config){
            if(data.resultCode==1){
                console.log(data);
                $scope.usss=data.provinceList;

            }else{
                console.log(data.resultInfo);
//                $cordovaToast.showShortCenter(data.resultInfo);
            }
        }).error(function(data,status,headers,config){
            $cordovaToast.showShortCenter('连接服务器失败啦!');
        });

        $scope.selectss=function(s){
            if(s!=null){
                var urlsss=API.ADDXMSS+sion.hardId+'/'+sion.sessionId+'/'+s;
                getServer.get(urlsss).success(function(data,status,headers,config){
                    if(data.resultCode==1){
                        console.log(data);
                        $scope.ussssr=data.cityList;

                    }else{
                        console.log(data.resultInfo);
//                $cordovaToast.showShortCenter(data.resultInfo);
                    }
                }).error(function(data,status,headers,config){
                    $cordovaToast.showShortCenter('连接服务器失败啦!');
                });
            }

        }

            $scope.xm={
            'userId':sion.userId, //用户ID
            'projectsheng':'',//省
            'projectAreaCode':'',//市
            'resourceSituation':'',//资源情况
            'projectsName':'',//项目名称
            'projectsAdd':'',//项目地址
            'projectsScale':'',//建设规模
            'structuralStyle':'',//结构形式
            'functionDesc':'',//使用功能和平面布局
            'projectsProgress':'',//目前项目进展
            'followupStatus':'',//目前跟进状态
            'ownerName':'',//业主单位名称
            'ownerPerson':'',//业主单位负责人
            'ownerPhone':'',//业主负责人电话
            'ownerAddress':'',//业主单位地址
            'technicalEngineer':'',//技术总工
            'engineerPhone':'',//技术总工电话
            'designName':'',//设计单位名称
            'designPerson':'',//设计单位负责人
            'designPhone':'',//设计单位电话
            'designAddress':'',//设计单位地址
            'enginName':'',//土建单位名称
            'enginPerson':'',//土建单位负责人
            'enginPhone':'',//土建单位电话
            'enginAddress':'',//土建单位地址
            'hardId':sion.hardId,
            'sessionId':sion.sessionId,
            'areaCode':sion.areaCode, //区域id
             'yzflist':'',
             'sjdwlist':''

            }
        var url=API.ADDXM;

        $scope.reqister=function(xm){

            if(yzfadd.length==0 && sjdwadd.length==0){
                $cordovaToast.showShortCenter('必须填写一个业主方或者单位!');
                return false;
            }

            xm.yzflist=yzfadd;
            xm.sjdwlist=sjdwadd;


//          pst=angular.fromJson(pst);
//           var obj=angular.extend({}, xm, pst);//合并两个对象
//            obj=angular.fromJson(xm);//字符串装json对象
            obj=angular.toJson(xm);  //json对象转字符串
            console.log(obj);
            postServer.post(url,obj).success(function(data,status,headers,config){

                if(data.resultCode==1){
                console.log(data.resultInfo);
                    $ionicHistory.goBack();
                    $cordovaToast.showShortCenter(data.resultInfo);
                }else{
//                    console.log(data.resultInfo);
                     $cordovaToast.showShortCenter(data.resultInfo);
                }
            }).error(function(data,status,headers,config){
                $cordovaToast.showShortCenter('连接服务器失败啦!');
            });
        }
//----------------------------------------业主方
        $scope.addxzf={
            'id':'',
            'ownerName':'',//业主单位名称
            'ownerPerson':'',//业主单位负责人
            'ownerPhone':'',//业主负责人电话
            'ownerAddress':'',//业主单位地址
            'technicalEngineer':'',//技术总工
            'engineerPhone':''//技术总工电话
        }


        //添加业主方页面
        $ionicModal.fromTemplateUrl('templates/xm-addyzf.html', {  //打开view所在的model
            scope: $scope,    //注入一个对象
            animation: 'slide-in-up', //动画
            backdropClickToClose:true  //点击背景是否隐藏默认true
            //第一个输入是否获取焦点
        }).then(function(modal){
            $scope.newReplieModal = modal; //显示视图
        });
//        $scope.$on('$destroy', function() {
//            $scope.modal.remove();
//        });
        //添加业主方弹出页面
        $scope.showLayer=function(){
            $scope.newReplieModal.show();
        }
        $scope.contact=[];
        var yzfadd=[];
        var obc=1;
        //提交数据页面
        var reg = /^0?1[3|4|5|8][0-9]\d{8}$/;
        $scope.newReplie=function(x){//


            if(x.ownerPerson==''){
                $cordovaToast.showShortCenter('请填写业主单位负责人!');
                return false;
            }
            if(!reg.test(x.ownerPhone)){
                $cordovaToast.showShortCenter('请填写正确的业主负责人手机号码!');
                return false;
            }
            if(x.engineerPhone!=''){
                if(!reg.test(x.engineerPhone)){
                    $cordovaToast.showShortCenter('请填写正确的技术总工手机号码!');
                    return false;
                }
            }


            obc=obc+1;
            x.id=obc;
            yzfadd.push(x);
            console.log(yzfadd);
            $scope.contact=yzfadd;
            $scope.newReplieModal.hide();
            newaccyzf();


        }
        //关闭页面
        $scope.newReplieModalst=function(){
            $scope.newReplieModal.hide();
            newaccyzf();
        }
        //初始化对象业主方
        function  newaccyzf(){
            $scope.addxzf={
                'id':'',
                'ownerName':'',//业主单位名称
                'ownerPerson':'',//业主单位负责人
                'ownerPhone':'',//业主负责人电话
                'ownerAddress':'',//业主单位地址
                'technicalEngineer':'',//技术总工
                'engineerPhone':''//技术总工电话
            }
        }
        $ionicModal.fromTemplateUrl('templates/xm-edityzf.html', {  //打开view所在的model
            scope: $scope,    //注入一个对象
            animation: 'slide-in-up', //动画
            backdropClickToClose:true  //点击背景是否隐藏默认true
            //第一个输入是否获取焦点
        }).then(function(modal){
            $scope.newReplieModals = modal; //显示视图
        });


        $scope.editxzf={
            'id':'',
            'ownerName':'',//业主单位名称
            'ownerPerson':'',//业主单位负责人
            'ownerPhone':'',//业主负责人电话
            'ownerAddress':'',//业主单位地址
            'technicalEngineer':'',//技术总工
            'engineerPhone':''//技术总工电话
        }

        //业主方详情
        $scope.xqyzf=function(k){
         for(var i=0;i<yzfadd.length;i++){
             if(yzfadd[i].id==k){
                 $scope.editxzf={
                     'id':k,
                     'ownerName':yzfadd[i].ownerName,//业主单位名称
                     'ownerPerson':yzfadd[i].ownerPerson,//业主单位负责人
                     'ownerPhone':yzfadd[i].ownerPhone,//业主负责人电话
                     'ownerAddress':yzfadd[i].ownerAddress,//业主单位地址
                     'technicalEngineer':yzfadd[i].technicalEngineer,//技术总工
                     'engineerPhone':yzfadd[i].engineerPhone//技术总工电话
                 }

             }
         }
            $scope.newReplieModals.show();
            console.log(k);

        }
        //关闭页面
        $scope.scnewReplieModals=function(){
            $scope.newReplieModals.hide();
//            var array = [1,2,3,4,5,6,7,8,9];
//            var filterarray = $.grep(array,function(value){
//                return value > 5;//筛选出大于5的
//            });
//            console.log(filterarray);
        }
        //提交修改页面
        $scope.tjnewReplie=function(y){
            if(y.ownerPerson==''){
                $cordovaToast.showShortCenter('请填写业主单位负责人!');
                return false;
            }
            if(!reg.test(y.ownerPhone)){
                $cordovaToast.showShortCenter('请填写正确的业主负责人手机号码!');
                return false;
            }
            if(y.engineerPhone!=''){
                if(!reg.test(y.engineerPhone)){
                    $cordovaToast.showShortCenter('请填写正确的技术总工手机号码!');
                    return false;
                }
            }

               for(var z=0;z<yzfadd.length;z++){
                   if(y.id==yzfadd[z].id){
                           yzfadd[z].ownerName=y.ownerName,//业主单位名称
                           yzfadd[z].ownerPerson=y.ownerPerson,//业主单位负责人
                           yzfadd[z].ownerPhone=y.ownerPhone,//业主负责人电话
                           yzfadd[z].ownerAddress=y.ownerAddress,//业主单位地址
                           yzfadd[z].technicalEngineer=y.technicalEngineer,//技术总工
                           yzfadd[z].engineerPhone=y.engineerPhone//技术总工电话
                   }
            }
//            console.log(yzfadd);
            $scope.contact=yzfadd;
            $scope.newReplieModals.hide();
        }
        //删除方法
        $scope.delyzf=function(y){
            $ionicPopup.confirm({
                title: '确认',
                content: '确认删除?',
                cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
                cancelType: '', // String (默认: 'button-default')。取消按钮的类型。
                okText: '确认', // String (默认: 'OK')。OK按钮的文字。
                okType: '' // String (默认: 'button-positive')。OK按钮的类型。
            }).then(function (res) {
                if (res) {
                    var filterarray = $.grep(yzfadd,function(value){
                        return value.id != y;//筛选出大于5的
                    });
                    yzfadd=filterarray;
                    $scope.contact=yzfadd;
                    console.log(yzfadd);

                } else {
                    console.log('You are not sure');
                }
            });




        }
//------------------------------------------------------设计单位
        $scope.addsjdw={
            'id':'',
            'designName':'',//设计单位名称
            'designPerson':'',//设计单位负责人
            'designPhone':'',//设计负责人电话
            'designAddress':''//设计单位地址
        }


        //添加设计单位页面
        $ionicModal.fromTemplateUrl('templates/xm-addsjdw.html', {  //打开view所在的model
            scope: $scope,    //注入一个对象
            animation: 'slide-in-up', //动画
            backdropClickToClose:true  //点击背景是否隐藏默认true
            //第一个输入是否获取焦点
        }).then(function(modal){
            $scope.newReplieModaladdsjdw = modal; //显示视图
        });

        //添加业主方弹出页面
        $scope.showSjdw=function(){
            $scope.newReplieModaladdsjdw.show();
        }

        $scope.sjdwlist=[];
        var sjdwadd=[];
        var cbo=1;
        //提交数据页面
        $scope.newRepliesjdw=function(x){

            if(x.designPerson==''){
                $cordovaToast.showShortCenter('请填写设计单位负责人!');
                return false;
            }
            if(!reg.test(x.designPhone)){
                $cordovaToast.showShortCenter('请填写正确的设计单位负责人手机号码!');
                return false;
            }

            cbo=cbo+1;
            x.id=cbo;
            sjdwadd.push(x);
            console.log(sjdwadd);
            $scope.sjdwlist=sjdwadd;
            $scope.newReplieModaladdsjdw.hide();
            newaccsjdw();


        }
        //关闭页面
        $scope.newReplieModalstsjdw=function(){
            $scope.newReplieModaladdsjdw.hide();
            newaccsjdw();
        }
        //初始化对象设计单位
        function  newaccsjdw(){
            $scope.addsjdw={
                'id':'',
                'designName':'',//设计单位名称
                'designPerson':'',//设计单位负责人
                'designPhone':'',//设计负责人电话
                'designAddress':''//设计单位地址
            }
        }

        $ionicModal.fromTemplateUrl('templates/xm-editsjdw.html', {  //打开view所在的model
            scope: $scope,    //注入一个对象
            animation: 'slide-in-up', //动画
            backdropClickToClose:true  //点击背景是否隐藏默认true
            //第一个输入是否获取焦点
        }).then(function(modal){
            $scope.newReplieModalseditsjdw = modal; //显示视图
        });


        $scope.editsjdw={
            'id':'',
            'designName':'',//设计单位名称
            'designPerson':'',//设计单位负责人
            'designPhone':'',//设计负责人电话
            'designAddress':''//设计单位地址
        }

        //业主方详情
        $scope.xqsjdw=function(k){
            for(var i=0;i<sjdwadd.length;i++){
                if(sjdwadd[i].id==k){
                    $scope.editsjdw={
                        'id':k,
                        'designName':sjdwadd[i].designName,//业主单位名称
                        'designPerson':sjdwadd[i].designPerson,//业主单位负责人
                        'designPhone':sjdwadd[i].designPhone,//业主负责人电话
                        'designAddress':sjdwadd[i].designAddress//业主单位地址

                    }

                }
            }
            $scope.newReplieModalseditsjdw.show();
        }
        //关闭页面
        $scope.newReplieModalstsjdwedit=function(){
            $scope.newReplieModalseditsjdw.hide();
        }
        //提交修改页面
        $scope.newRepliesjdwedit=function(y){
            if(y.designPerson==''){
                $cordovaToast.showShortCenter('请填写设计单位负责人!');
                return false;
            }
            if(!reg.test(y.designPhone)){
                $cordovaToast.showShortCenter('请填写正确的设计单位负责人手机号码!');
                return false;
            }

            for(var z=0;z<sjdwadd.length;z++){
                if(y.id==sjdwadd[z].id){
                    sjdwadd[z].designName=y.designName,//业主单位名称
                        sjdwadd[z].designPerson=y.designPerson,//业主单位负责人
                        sjdwadd[z].designPhone=y.designPhone,//业主负责人电话
                        sjdwadd[z].designAddress=y.designAddress//业主单位地址
                }
            }
            $scope.sjdwlist=sjdwadd;
            $scope.newReplieModalseditsjdw.hide();
//            console.log(sjdwadd);
        }
        //删除方法
        $scope.delsjdw=function(y){
            $ionicPopup.confirm({
                title: '确认',
                content: '确认删除?',
                cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
                cancelType: '', // String (默认: 'button-default')。取消按钮的类型。
                okText: '确认', // String (默认: 'OK')。OK按钮的文字。
                okType: '' // String (默认: 'button-positive')。OK按钮的类型。
            }).then(function (res) {
                if (res) {
                    var filterarray = $.grep(sjdwadd,function(value){
                        return value.id != y;//筛选出删除的
                    });
                    sjdwadd=filterarray;
                    $scope.sjdwlist=sjdwadd;
                    console.log(sjdwadd);

                } else {
                    console.log('You are not sure');
                }
            });

        }
    }])

    //项目驳回
.controller('xmbhCtrl',['$scope','$ionicPopup','$cordovaToast','$ionicHistory','$ionicModal','postServer','sessionService','$stateParams','getServer', function($scope,$ionicPopup,$cordovaToast,$ionicHistory,$ionicModal,postServer,sessionService,$stateParams,getServer) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }
        $scope.toggleGroup = function(group) {
            group.id = !group.id;
        };
        $scope.toggleGroups = function(group) {
            group.id = !group.id;
        };


        $scope.isGroupShown = function(group) {
            return group.id;
        };
        $scope.isGroupShowns = function(group) {
            return group.id;
        };


        $scope.pp={};
        $scope.pp.yzf=false;
        $scope.showyzf=function(){
            var t=$scope.pp.yzf;
            if(t==true){
                $scope.pp.yzf=false;
            }else{
                $scope.pp.yzf=true;
            }
        }
        var projectsId=undefined;
        var ids=$stateParams.ids;
        var idy=$stateParams.idy;
        var sion=sessionService.getsession();//获取缓存数据
        var url=API.XMXQ+sion.hardId+'/'+sion.sessionId+'/'+ids+'/'+idy;
        getServer.get(url).success(function(data,status,headers,config){
             console.log(data);
            if(data.resultCode==1){
               for(var i=0;i<data.addProject.ownerList.length;i++){
                   data.addProject.ownerList[i].id=false;
               }
                for(var k=0;k<data.addProject.designList.length;k++){
                    data.addProject.designList[k].id=false;
                }
                $scope.xm=data.addProject;
            }else{
                $cordovaToast.showShortCenter(data.resultInfo);
            }
        }).error(function(data,status,headers,config){
            $cordovaToast.showShortCenter('连接服务器失败啦!');
        });

        $scope.xmbh=function(i){//项目驳回
            $ionicPopup.confirm({
                title: '确认',
                content: '确认驳回?',
                cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
                cancelType: '', // String (默认: 'button-default')。取消按钮的类型。
                okText: '确认', // String (默认: 'OK')。OK按钮的文字。
                okType: '' // String (默认: 'button-positive')。OK按钮的类型。
            }).then(function (res) {
                if (res) {
                    var urlss=API.XMZPR;
                    var tr={
                        'hardId':sion.hardId,
                        'sessionId':sion.sessionId,
                        'projectsId':i,
                        'userId':sion.userId,
                        'leadType':2
                    }
                    tr=angular.fromJson(tr);
                    postServer.post(urlss,tr).success(function(data,status,headers,config){
                        if(data.resultCode==1){
                            $ionicHistory.goBack();
                            $cordovaToast.showShortCenter(data.resultInfo);
                        }else{
                            $cordovaToast.showShortCenter(data.resultInfo);
                        }
                    }).error(function(data,status,headers,config){
                        $cordovaToast.showShortCenter('连接服务器失败啦!');
                    });

                } else {
                    console.log('You are not sure');
                }
            });

        }



        $ionicModal.fromTemplateUrl('templates/xm_zpr.html', {  //打开view所在的model
            scope: $scope,    //注入一个对象
            animation: 'slide-in-up', //动画
            backdropClickToClose:true  //点击背景是否隐藏默认true
            //第一个输入是否获取焦点
        }).then(function(modal){
            $scope.newReplieModal = modal; //显示视图
        });


        $scope.zpr=function(i){
            projectsId=i;
            var urls=API.ADDZPR+sion.hardId+'/'+sion.sessionId+'/'+sion.areaCode;
            getServer.get(urls).success(function(data,status,headers,config){
                if(data.resultCode==1){
                    $scope.contacts=data.projectUserList;
                    $scope.newReplieModal.show();   //显示model
                    console.log(data);
                }else{
                    $cordovaToast.showShortCenter(data.resultInfo);
                }
            }).error(function(data,status,headers,config){
                $cordovaToast.showShortCenter('连接服务器失败啦!');
            });

        }
        var strid=undefined;
        $scope.slectbu=function(u){
            strid=u;
        }

        $scope.newReplie=function(){//提交指派人
            if(strid==undefined){
                $cordovaToast.showShortCenter("请选择指派人员");
                return false;
            }
            $ionicPopup.confirm({
                title: '确认',
                content: '确认指派?',
                cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
                cancelType: '', // String (默认: 'button-default')。取消按钮的类型。
                okText: '确认', // String (默认: 'OK')。OK按钮的文字。
                okType: '' // String (默认: 'button-positive')。OK按钮的类型。
            }).then(function (res) {
                if (res) {
                    var urlss=API.XMZPR;
                    var tr={
                        'hardId':sion.hardId,
                        'sessionId':sion.sessionId,
                        'projectsId':projectsId,
                        'userId':sion.userId,
                        'leadType':1,
                        'salePerson':strid
                    }
                    tr=angular.fromJson(tr);
                    console.log(tr);
                    postServer.post(urlss,tr).success(function(data,status,headers,config){
                        if(data.resultCode==1){
                            console.log(data);
                            $scope.newReplieModal.hide();
                            strid=undefined;
                            $ionicHistory.goBack();
                            $cordovaToast.showShortCenter(data.resultInfo);
                        }else{
                            $cordovaToast.showShortCenter(data.resultInfo);
                        }
                    }).error(function(data,status,headers,config){
                        $cordovaToast.showShortCenter('连接服务器失败啦!');
                    });
                } else {
                    console.log('You are not sure');
                }
            });
        }
        $scope.newReplieModals=function(){
            strid=undefined;
            $scope.newReplieModal.hide();
        }

    }])

//项目详情
    .controller('xmxqCtrl',['$scope','$ionicPopup','$cordovaToast','$ionicHistory','$ionicModal','postServer','sessionService','$stateParams','getServer', function($scope,$ionicPopup,$cordovaToast,$ionicHistory,$ionicModal,postServer,sessionService,$stateParams,getServer) {
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
        var sion=sessionService.getsession();//获取缓存数据
        $scope.xm={
            'userId':sion.userId, //用户ID
            'projectsheng':'',//省
            'projectAreaCode':'',//市
            'resourceSituation':'',//资源情况
            'projectsName':'',//项目名称
            'projectsAdd':'',//项目地址
            'projectsScale':'',//建设规模
            'structuralStyle':'',//结构形式
            'functionDesc':'',//使用功能和平面布局
            'projectsProgress':'',//目前项目进展
            'followupStatus':'',//目前跟进状态
            'ownerName':'',//业主单位名称
            'ownerPerson':'',//业主单位负责人
            'ownerPhone':'',//业主负责人电话
            'ownerAddress':'',//业主单位地址
            'technicalEngineer':'',//技术总工
            'engineerPhone':'',//技术总工电话
            'designName':'',//设计单位名称
            'designPerson':'',//设计单位负责人
            'designPhone':'',//设计单位电话
            'designAddress':'',//设计单位地址
            'enginName':'',//土建单位名称
            'enginPerson':'',//土建单位负责人
            'enginPhone':'',//土建单位电话
            'enginAddress':'',//土建单位地址
            'hardId':sion.hardId,
            'sessionId':sion.sessionId,
            'areaCode':sion.areaCode, //区域id
            'yzflist':'',
            'sjdwlist':''

        }
        var projectsId=undefined;
        var ids=$stateParams.ids;
        var idy=$stateParams.idy;
        var idz=$stateParams.idz;
        var xmzt='';
        if(idz==2){
            xmzt='已终止';
        }else if(idz==3){
            xmzt='进行中';
        }else if(idz==4){
            xmzt='合同中';
        }
        $scope.xmzts=xmzt;
        var url=API.XMXQ+sion.hardId+'/'+sion.sessionId+'/'+ids+'/'+idy;
        getServer.get(url).success(function(data,status,headers,config){
            if(data.resultCode==1){
                $scope.xm=data.addProject;
                console.log(data);
            }else{
                $cordovaToast.showShortCenter(data.resultInfo);
            }
        }).error(function(data,status,headers,config){
            $cordovaToast.showShortCenter('连接服务器失败啦!');
        });

        $scope.reqister=function(u){

            var urlss=API.EDITXM;
            u.userId=sion.userId; //用户ID
            u.hardId=sion.hardId;
            u.sessionId=sion.sessionId;
            u.yzflist=yzfadd;
            u.sjdwlist=sjdwadd;
            obj=angular.toJson(u);  //json对象转字符串
            //console.log(obj);
            postServer.post(urlss,obj).success(function(data,status,headers,config){
                if(data.resultCode==1){
                    console.log(data.resultInfo);
                    $ionicHistory.goBack();
                    $cordovaToast.showShortCenter(data.resultInfo);
                }else{
//                    console.log(data.resultInfo);
                    $cordovaToast.showShortCenter(data.resultInfo);
                }
            }).error(function(data,status,headers,config){
                $cordovaToast.showShortCenter('连接服务器失败啦!');
            });
        }

        //初始化对象业主方
        function  newaccyzf(){
            $scope.addxzf={
                'id':'',
                'ownerName':'',//业主单位名称
                'ownerPerson':'',//业主单位负责人
                'ownerPhone':'',//业主负责人电话
                'ownerAddress':'',//业主单位地址
                'technicalEngineer':'',//技术总工
                'engineerPhone':''//技术总工电话
            }
        }

        $scope.addxzf={
            'id':'',
            'ownerName':'',//业主单位名称
            'ownerPerson':'',//业主单位负责人
            'ownerPhone':'',//业主负责人电话
            'ownerAddress':'',//业主单位地址
            'technicalEngineer':'',//技术总工
            'engineerPhone':''//技术总工电话
        }


        //添加业主方页面
        $ionicModal.fromTemplateUrl('templates/xm-addyzf.html', {  //打开view所在的model
            scope: $scope,    //注入一个对象
            animation: 'slide-in-up', //动画
            backdropClickToClose:true  //点击背景是否隐藏默认true
            //第一个输入是否获取焦点
        }).then(function(modal){
            $scope.newReplieModal = modal; //显示视图
        });

        //添加业主方弹出页面
        $scope.showLayer=function(){
            $scope.newReplieModal.show();
        }
        $scope.contact=[];
        var yzfadd=[];
        var obc=1;
        //提交数据页面
        var reg = /^0?1[3|4|5|8][0-9]\d{8}$/;
        $scope.newReplie=function(x){//

            if(x.ownerPerson==''){
                $cordovaToast.showShortCenter('请填写业主单位负责人!');
                return false;
            }
            if(!reg.test(x.ownerPhone)){
                $cordovaToast.showShortCenter('请填写正确的业主负责人手机号码!');
                return false;
            }
            if(x.engineerPhone!=''){
                if(!reg.test(x.engineerPhone)){
                    $cordovaToast.showShortCenter('请填写正确的技术总工手机号码!');
                    return false;
                }
            }
            obc=obc+1;
//            console.log(obc);
            x.id=obc;
//            console.log(x);
            yzfadd.push(x);
            console.log(yzfadd);
            $scope.contact=yzfadd;
            $scope.newReplieModal.hide();
            newaccyzf();


        }
        //关闭页面
        $scope.newReplieModalst=function(){
            $scope.newReplieModal.hide();
            newaccyzf();
        }
        $ionicModal.fromTemplateUrl('templates/xm-edityzf.html', {  //打开view所在的model
            scope: $scope,    //注入一个对象
            animation: 'slide-in-up', //动画
            backdropClickToClose:true  //点击背景是否隐藏默认true
            //第一个输入是否获取焦点
        }).then(function(modal){
            $scope.newReplieModals = modal; //显示视图
        });


        $scope.editxzf={
            'id':'',
            'ownerName':'',//业主单位名称
            'ownerPerson':'',//业主单位负责人
            'ownerPhone':'',//业主负责人电话
            'ownerAddress':'',//业主单位地址
            'technicalEngineer':'',//技术总工
            'engineerPhone':''//技术总工电话
        }

        //业主方详情
        $scope.xqyzf=function(k){
            for(var i=0;i<yzfadd.length;i++){
                if(yzfadd[i].id==k){
                    $scope.editxzf={
                        'id':k,
                        'ownerName':yzfadd[i].ownerName,//业主单位名称
                        'ownerPerson':yzfadd[i].ownerPerson,//业主单位负责人
                        'ownerPhone':yzfadd[i].ownerPhone,//业主负责人电话
                        'ownerAddress':yzfadd[i].ownerAddress,//业主单位地址
                        'technicalEngineer':yzfadd[i].technicalEngineer,//技术总工
                        'engineerPhone':yzfadd[i].engineerPhone//技术总工电话
                    }

                }
            }
            $scope.newReplieModals.show();
            console.log(k);

        }
        //关闭页面
        $scope.scnewReplieModals=function(){
            $scope.newReplieModals.hide();

        }
        //提交修改页面
        $scope.tjnewReplie=function(y){
            if(y.ownerPerson==''){
                $cordovaToast.showShortCenter('请填写业主单位负责人!');
                return false;
            }
            if(!reg.test(y.ownerPhone)){
                $cordovaToast.showShortCenter('请填写正确的业主负责人手机号码!');
                return false;
            }
            if(y.engineerPhone!=''){
                if(!reg.test(y.engineerPhone)){
                    $cordovaToast.showShortCenter('请填写正确的技术总工手机号码!');
                    return false;
                }
            }

            for(var z=0;z<yzfadd.length;z++){
                if(y.id==yzfadd[z].id){
                    yzfadd[z].ownerName=y.ownerName,//业主单位名称
                        yzfadd[z].ownerPerson=y.ownerPerson,//业主单位负责人
                        yzfadd[z].ownerPhone=y.ownerPhone,//业主负责人电话
                        yzfadd[z].ownerAddress=y.ownerAddress,//业主单位地址
                        yzfadd[z].technicalEngineer=y.technicalEngineer,//技术总工
                        yzfadd[z].engineerPhone=y.engineerPhone//技术总工电话
                }
            }
//            console.log(yzfadd);
            $scope.contact=yzfadd;
            $scope.newReplieModals.hide();
        }
        //删除方法
        $scope.delyzf=function(y){
            $ionicPopup.confirm({
                title: '确认',
                content: '确认删除?',
                cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
                cancelType: '', // String (默认: 'button-default')。取消按钮的类型。
                okText: '确认', // String (默认: 'OK')。OK按钮的文字。
                okType: '' // String (默认: 'button-positive')。OK按钮的类型。
            }).then(function (res) {
                if (res) {
                    var filterarray = $.grep(yzfadd,function(value){
                        return value.id != y;//筛选出大于5的
                    });
                    yzfadd=filterarray;
                    $scope.contact=yzfadd;
                    console.log(yzfadd);

                } else {
                    console.log('You are not sure');
                }
            });
        }

        //------------------------------------------------------设计单位
        $scope.addsjdw={
            'id':'',
            'designName':'',//设计单位名称
            'designPerson':'',//设计单位负责人
            'designPhone':'',//设计负责人电话
            'designAddress':''//设计单位地址
        }


        //添加设计单位页面
        $ionicModal.fromTemplateUrl('templates/xm-addsjdw.html', {  //打开view所在的model
            scope: $scope,    //注入一个对象
            animation: 'slide-in-up', //动画
            backdropClickToClose:true  //点击背景是否隐藏默认true
            //第一个输入是否获取焦点
        }).then(function(modal){
            $scope.newReplieModaladdsjdw = modal; //显示视图
        });

        //添加业主方弹出页面
        $scope.showSjdw=function(){
            $scope.newReplieModaladdsjdw.show();
        }

        $scope.sjdwlist=[];
        var sjdwadd=[];
        var cbo=1;
        //提交数据页面
        $scope.newRepliesjdw=function(x){

            if(x.designPerson==''){
                $cordovaToast.showShortCenter('请填写设计单位负责人!');
                return false;
            }
            if(!reg.test(x.designPhone)){
                $cordovaToast.showShortCenter('请填写正确的设计单位负责人手机号码!');
                return false;
            }

            cbo=cbo+1;
            x.id=cbo;
            sjdwadd.push(x);
            console.log(sjdwadd);
            $scope.sjdwlist=sjdwadd;
            $scope.newReplieModaladdsjdw.hide();
            newaccsjdw();


        }
        //关闭页面
        $scope.newReplieModalstsjdw=function(){
            $scope.newReplieModaladdsjdw.hide();
            newaccsjdw();
        }
        //初始化对象设计单位
        function  newaccsjdw(){
            $scope.addsjdw={
                'id':'',
                'designName':'',//设计单位名称
                'designPerson':'',//设计单位负责人
                'designPhone':'',//设计负责人电话
                'designAddress':''//设计单位地址
            }
        }

        $ionicModal.fromTemplateUrl('templates/xm-editsjdw.html', {  //打开view所在的model
            scope: $scope,    //注入一个对象
            animation: 'slide-in-up', //动画
            backdropClickToClose:true  //点击背景是否隐藏默认true
            //第一个输入是否获取焦点
        }).then(function(modal){
            $scope.newReplieModalseditsjdw = modal; //显示视图
        });


        $scope.editsjdw={
            'id':'',
            'designName':'',//设计单位名称
            'designPerson':'',//设计单位负责人
            'designPhone':'',//设计负责人电话
            'designAddress':''//设计单位地址
        }

        //业主方详情
        $scope.xqsjdw=function(k){
            for(var i=0;i<sjdwadd.length;i++){
                if(sjdwadd[i].id==k){
                    $scope.editsjdw={
                        'id':k,
                        'designName':sjdwadd[i].designName,//业主单位名称
                        'designPerson':sjdwadd[i].designPerson,//业主单位负责人
                        'designPhone':sjdwadd[i].designPhone,//业主负责人电话
                        'designAddress':sjdwadd[i].designAddress//业主单位地址

                    }

                }
            }
            $scope.newReplieModalseditsjdw.show();
        }
        //关闭页面
        $scope.newReplieModalstsjdwedit=function(){
            $scope.newReplieModalseditsjdw.hide();
        }
        //提交修改页面
        $scope.newRepliesjdwedit=function(y){
            if(y.designPerson==''){
                $cordovaToast.showShortCenter('请填写设计单位负责人!');
                return false;
            }
            if(!reg.test(y.designPhone)){
                $cordovaToast.showShortCenter('请填写正确的设计单位负责人手机号码!');
                return false;
            }

            for(var z=0;z<sjdwadd.length;z++){
                if(y.id==sjdwadd[z].id){
                    sjdwadd[z].designName=y.designName,//业主单位名称
                        sjdwadd[z].designPerson=y.designPerson,//业主单位负责人
                        sjdwadd[z].designPhone=y.designPhone,//业主负责人电话
                        sjdwadd[z].designAddress=y.designAddress//业主单位地址
                }
            }
            $scope.sjdwlist=sjdwadd;
            $scope.newReplieModalseditsjdw.hide();
//            console.log(sjdwadd);
        }
        //删除方法
        $scope.delsjdw=function(y){
            $ionicPopup.confirm({
                title: '确认',
                content: '确认删除?',
                cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
                cancelType: '', // String (默认: 'button-default')。取消按钮的类型。
                okText: '确认', // String (默认: 'OK')。OK按钮的文字。
                okType: '' // String (默认: 'button-positive')。OK按钮的类型。
            }).then(function (res) {
                if (res) {
                    var filterarray = $.grep(sjdwadd,function(value){
                        return value.id != y;//筛选出删除的
                    });
                    sjdwadd=filterarray;
                    $scope.sjdwlist=sjdwadd;
                    console.log(sjdwadd);

                } else {
                    console.log('You are not sure');
                }
            });

        }
    }])
//我的消息
    .controller('wdxxCtrl',['$scope','$ionicHistory', function($scope,$ionicHistory) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }
    }])
//我的设置
    .controller('wdszCtrl',['$scope','$timeout','$cordovaFileOpener2','$cordovaDevice','$cordovaFileTransfer','$ionicLoading','appUpdateServer','$cacheFactory','sessionService','postServer','$cordovaToast','$ionicHistory','$ionicPopup','$state', function($scope,$timeout,$cordovaFileOpener2,$cordovaDevice,$cordovaFileTransfer,$ionicLoading,appUpdateServer,$cacheFactory,sessionService,postServer,$cordovaToast,$ionicHistory,$ionicPopup,$state) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        };
        var systems=$cordovaDevice.getPlatform();//操作系统
        $scope.phoneType==false;
        if(systems == 'iOS'){
            $scope.phoneType=false;//手机类型
        }else{
            $scope.phoneType=true;
        }
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
                           var cach=$cacheFactory.get('cacheId');
                               // cach.remove('sion');
                                cach.removeAll();
                            $state.go("login");
                            console.log(cach.get('sion'));
                } else {
                    //console.log('You are not sure');
                }
            });
        }

        //更新
        $scope.appupdate=function(){
            appUpdateServer.appUpdate().success(function(data,status,headers,config){
                if(data.resultCode==1){
                    console.log(data);
                    $scope.showUpdateConfirm(data.version);
                }else{

                    $cordovaToast.showShortCenter(data.resultInfo);
                    // console.log(data);
                }
            }).error(function(data,status,headers,config){
                $cordovaToast.showShortCenter('连接服务器失败啦!');
            });
          }

          $scope.showUpdateConfirm=function(t){
              var confirmPopup = $ionicPopup.confirm({
                  title: '新版本升级',
                  template: t.appDesc, //从服务端获取更新的内容
                  cancelText: '取消',
                  okText: '升级'
              });
              confirmPopup.then(function (res) {
                  if (res) {
                    if(t.appType=='android') {
                      $ionicLoading.show({
                          template: "已经下载：0%"
                      });
                      var url = API.XZAPPURL+t.netPath; //可以从服务端获取更新APP的路径
                      var targetPath = "file:///storage/sdcard0/Download/lxzs.apk"; //APP下载存放的路径，可以使用cordova file插件进行相关配置
                      var trustHosts = true
                      var options = {};
                      $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
                          // 打开下载下来的APP
                          $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive'
                          ).then(function () {
                                  // 成功
                              }, function (err) {
                                  // 错误
                              });
                          $ionicLoading.hide();
                      }, function (err) {
                          $ionicLoading.hide();
                          alert('下载失败');
                      }, function (progress) {
                          //进度，这里使用文字显示下载百分比
                          $timeout(function () {
                              var downloadProgress = (progress.loaded / progress.total) * 100;
                              $ionicLoading.show({
                                  template: "已经下载：" + Math.floor(downloadProgress) + "%"
                              });
                              if (downloadProgress > 99) {
                                  $ionicLoading.hide();
                              }
                          })
                      });
                    }else if(t.appType=='ios'){
                        var ul=t.netPath;
                        window.open(ul);
                    }
                  } else {
                      // 取消更新
                  }
              });
          }

    }])




//新增任务
    .controller('addrwCtrl',['$scope','$filter','getServer','$ionicHistory','$cordovaToast','sessionService','postServer','$ionicPopup','$timeout', function($scope,$filter,getServer,$ionicHistory,$cordovaToast,sessionService,postServer,$ionicPopup,$timeout) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }
        $scope.selectshow=false;
        var sion=sessionService.getsession();//获取缓存数据


        $scope.tlk={taskDesc:'',completeDate:new Date(),followupStatus:'','relationProject':'','hardId':sion.hardId,'sessionId':sion.sessionId,'userId':sion.userId};

        $scope.showxmjd=function(x){
            if(x!=null){
              $scope.selectshow=true;
            }else{
               $scope.selectshow=false;
               $scope.tlk.follwupStatus='';
            }
        }

        $scope.reqister=function(u){
            var d2=new Date();//取今天的日期
            var d1=u.completeDate;

          var  dates = $filter('date')(d1, "yyyy-MM-dd");
            u.completeDate=dates;

            var url=API.ADDRW;
            console.log(u);
            postServer.post(url,u).success(function(data,status,headers,config){
                if(data.resultCode==1){
                    $ionicHistory.goBack();
                    $cordovaToast.showShortCenter(data.resultInfo);
                }else{
                    $cordovaToast.showShortCenter(data.resultInfo);

                }
            }).error(function(data,status,headers,config){
                $cordovaToast.showShortCenter('连接服务器失败啦!');
            });
        }
                var  urls=API.ZPRWLIST+sion.hardId+'/'+sion.sessionId+'/'+sion.userId;
                getServer.get(urls).success(function(data,status,headers,config){
                    if(data.resultCode==1){
                        console.log(data);
                        $scope.users=data.projrctList;
                    }else{
                        $cordovaToast.showShortCenter(data.resultInfo);

                    }
                }).error(function(data,status,headers,config){
                    $cordovaToast.showShortCenter('连接服务器失败啦!');
                });
    }])
//修改密码
    .controller('xgmmCtrl',['$scope','$cordovaToast','postServer','sessionService','$ionicHistory', function($scope,$cordovaToast,postServer,sessionService,$ionicHistory) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }

        var sion=sessionService.getsession();//获取缓存数据
        $scope.mm={
            'hardId':sion.hardId,
            'sessionId':sion.sessionId,
            'oldPassword':'',
            'newPassword':'',
            'newPasswords':'',
            'userId':sion.userId
    }
     $scope.reqister=function(mm){
         var newp=mm.newPassword;
         var newps=mm.newPasswords;
         if(newp!=newps){
             $cordovaToast.showShortCenter("新密码不一致");
             return false;
         }
         var url=API.XGMM;
         var oldps=hex_md5(mm.oldPassword);
         var newps=hex_md5(mm.newPassword);
         mm.oldPassword=oldps;
         mm.newPassword=newps;
         postServer.post(url,mm).success(function(data,status,headers,config){
             if(data.resultCode==1){
                 console.log(data.resultInfo);
                 $ionicHistory.goBack();
                 $cordovaToast.showShortCenter(data.resultInfo);

             }else{
                 $cordovaToast.showShortCenter(data.resultInfo);

             }
         }).error(function(data,status,headers,config){
             $cordovaToast.showShortCenter('连接服务器失败啦!');
         });
     }
    }])
//客户详细情况
    .controller('khxxqkCtrl',['$scope','$cordovaSms','$cordovaToast','postServer','$stateParams','getServer','sessionService','$ionicHistory','$ionicPopup', function($scope,$cordovaSms,$cordovaToast,postServer,$stateParams,getServer,sessionService,$ionicHistory,$ionicPopup) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        };
        $scope.kh={
            'customerId':'',
            'customerName':'',
            'customerPhone':'',
            'unitAddress':'',
            'unitName':'',
            'customerJob':''
        };
        var ids=$stateParams.ids;
        var sion=sessionService.getsession();//获取缓存数据
        var url=API.KHGRXX+sion.hardId+'/'+sion.sessionId+'/'+ids;//获取url
        getServer.get(url).success(function(data,status,headers,config){
            console.log(data);
            if(data.resultCode==1){
                $scope.kh=data.cust;

            }else{
                $cordovaToast.showShortCenter(data.resultInfo);
            }
        }).error(function(data,status,headers,config){
            $cordovaToast.showShortCenter('连接服务器失败啦!');
        });


        $scope.delkh=function(){
           // console.log(u);
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
                   var urls=API.DELKH;
                    var obj={
                        'hardId':sion.hardId,
                        'sessionId':sion.sessionId,
                        'userId':sion.userId,
                        'custId':ids
                    }
                     obj=angular.fromJson(obj);
                    postServer.post(urls,obj).success(function(data,status,headers,config){
                        if(data.resultCode==1){
                            console.log(data.resultInfo);
                            $ionicHistory.goBack();
                            $cordovaToast.showShortCenter(data.resultInfo);
                        }else{
                            $cordovaToast.showShortCenter(data.resultInfo);
                        }
                     }).error(function(data,status,headers,config){
                        $cordovaToast.showShortCenter('连接服务器失败啦!');
                });
                } else {
                    console.log('You are not sure');
                }
            });
        };

        //发送短信
        $scope.sendDx=function(y){
            $scope.date = {
            };
            var options = {
                replaceLineBreaks: false, // true to replace \n by a new line, false by default
                android: {
                    intent: 'INTENT'  // send SMS with the native android SMS messaging
                    //intent: ‘‘ // send SMS without open any other app
                }
            };
            $cordovaSms
                .send(y, '', options)
                .then(function() {

                }, function(error) {
                    $cordovaToast.showShortCenter(error);
                });

        }
    }])
//修改客户信息修改
    .controller('editkhCtrl',['$scope','$cordovaToast','$filter','$ionicHistory','sessionService','$stateParams','postServer',function($scope,$cordovaToast,$filter,$ionicHistory,sessionService,$stateParams,postServer) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }
        $scope.kh=angular.fromJson($stateParams.idmodel);
            var url=API.EDITKHXX;
        var sion=sessionService.getsession();//获取缓存数据
            var pst={
                'hardId':sion.hardId,
                'sessionId':sion.sessionId,
                'userId':sion.userId
            }
           pst=angular.fromJson(pst);
          $scope.reqister=function(ks) {
            var obj=angular.extend({}, ks, pst);//合并两个对象
            console.log(obj);
            postServer.post(url, obj).success(function (data, status, headers, config) {
                if(data.resultCode==1){
                    console.log(data.resultInfo);
                    $ionicHistory.goBack();
                    $cordovaToast.showShortCenter(data.resultInfo);

                }else{
                    $cordovaToast.showShortCenter(data.resultInfo);
                }
            }).error(function (data, status, headers, config) {
                $cordovaToast.showShortCenter('连接服务器失败啦!');
            });
          }

    }])
//忘记密码
    .controller('wjmmCtrl',['$scope','$cordovaDevice','sessionService','postServer','$ionicHistory','$interval','$cordovaToast', function($scope,$cordovaDevice,sessionService,postServer,$ionicHistory,$interval,$cordovaToast) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }
        var hardIds=$cordovaDevice.getUUID();//
        var tel=undefined;
       $scope.test={
           'phone':tel,
           'hardId':hardIds,
           'indetifyingCode':'',
           'newPassword':'',
           'newPasswords':''
       };

       $scope.ss=false;
       $scope.wjmmclass="button button-small button-positive";
       $scope.wjmm="获取验证码";
        var reg = /^0?1[3|4|5|8][0-9]\d{8}$/;


        $scope.hqyzm=function(){//点击获取验证码
            // alert(angular.element(document.querySelector('#tel')).val());//内置对象获取
            tel=$scope.test.phone;
            if(!reg.test(tel) ){
                $cordovaToast.showShortCenter("请输入正确的手机号码");
                return  false;
            }
            var hardId=hardIds;
            var url=API.HQYZM;
            var obj={'phone':tel,'hardId':hardId};
            obj=angular.fromJson(obj);

            console.log(obj);
            postServer.post(url, obj).success(function (data, status, headers, config) {
                if(data.resultCode==1){
                    console.log(data);
                    $scope.ss=true;
                    $scope.wjmmclass="button button-small button-calm";
                    $scope.n=60;
                    $scope.wjmm= $scope.n+'秒';
                    var time=$interval(function(){
                        $scope.n--;
                        $scope.wjmm= $scope.n+'秒';
                        if($scope.n==0){
                            $scope.ss=false;
                            $scope.wjmmclass="button button-small button-positive";
                            $scope.wjmm="获取验证码";
                            $interval.cancel(time);
                        }
                    },1000);

                }else{
                    $cordovaToast.showShortCenter(data.resultInfo);
                }
            }).error(function (data, status, headers, config) {
                $cordovaToast.showShortCenter('连接服务器失败啦!');
            });
        }
        //提交
        $scope.reqister=function(u){
            var ps1=$scope.newPassword;
            var ps2=$scope.newPasswords;
            if(ps1!=ps2){
                $cordovaToast.showShortCenter("两次密码不一致");
                // $cordovaToast.showShortCenter('两次密码不一致');
                return false;
            }
            var oldps=hex_md5(u.newPassword);
            u.newPassword=oldps;//md5加密
            var url=API.QRXMM;
            postServer.post(url, u).success(function (data, status, headers, config) {
                if(data.resultCode==1){
                    console.log(data.resultInfo);
                    $ionicHistory.goBack();
                    $cordovaToast.showShortCenter(data.resultInfo);

                }else{
                    $cordovaToast.showShortCenter(data.resultInfo);
                }
            }).error(function (data, status, headers, config) {
                $cordovaToast.showShortCenter('连接服务器失败啦!');
            });
        }
    }])
//日程表
    .controller('rcbCtrl',['$scope','$cordovaToast','$ionicHistory','$filter', function($scope,$cordovaToast,$ionicHistory,$filter) {
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
                $cordovaToast.showShortCenter(dateText);
                   }
        })
            var currentDate = jQuery( ".ui_timepicker" ).datepicker( "getDate" );
           // currentDate=new Date(currentDate);currentDate.valueOf()
            //alert(currentDate);
       // alert($filter("date")(currentDate.valueOf(), "yyyy-MM-dd hh:mm:ss"));

    }]);
