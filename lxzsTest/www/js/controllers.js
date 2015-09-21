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

            params=angular.fromJson(params);
            postServer.post(url,params).success(function(data,status,headers,config) {
                $ionicLoading.hide();
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
.controller('rwController',['$scope','postServer','$ionicPopup','$timeout','$cordovaToast','getServer','sessionService','$location','$state',function($scope,postServer,$ionicPopup,$timeout,$cordovaToast,getServer,sessionService,$location,$state) {
        $scope.rcb=function(){
            $state.go('rcb');//日程表
        }
        var sion=sessionService.getsession();//获取缓存数据
        $scope.onTabSelected=function(index){
           if(index==1){
               $scope.shwomor=true;
               var currPage=0;  //当前页数
               var pageSize=10; //每页条数

               currPage=currPage+1;
               var url=API.RWLIST+sion.hardId+'/'+sion.sessionId+"/"+sion.userId+'/'+index+'/'+currPage+'/'+pageSize;//获取url

               //客户列表查询
               getServer.get(url).success(function(data,status,headers,config){
                   if(data.resultCode==1){
                       $scope.rwlist=data.taskList;
                       if(data.taskList.length<10){
                           $scope.shwomor=false;
                       }
                       console.log(data);
                   }else{
                       $scope.rwlist=data.taskList;
                       $cordovaToast.showShortCenter(data.resultInfo);
                   }
               }).error(function(data,status,headers,config){
                   $cordovaToast.showShortCenter('连接服务器失败啦!');
               });
               $scope.loadMore=function(){
                   $timeout( function() {
                       currPage=currPage+1;
                       var url=API.RWLIST+sion.hardId+'/'+sion.sessionId+"/"+sion.userId+'/'+index+'/'+currPage+'/'+pageSize;//获取url
                        console.log(url);
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
                           $cordovaToast.showShortCenter('连接服务器失败啦!');
                       });
                       $scope.$broadcast('scroll.infiniteScrollComplete');

                   }, 1000);

               }

           }else if(index==3){
               $scope.shwomor=true;
               var currPage=0;  //当前页数
               var pageSize=10; //每页条数
               currPage=currPage+1;
               var url=API.RWLIST+sion.hardId+'/'+sion.sessionId+"/"+sion.userId+'/'+index+'/'+currPage+'/'+pageSize;//获取url

               //客户列表查询
               getServer.get(url).success(function(data,status,headers,config){
                   if(data.resultCode==1){
                       $scope.rwlist3=data.taskList;
                       if(data.taskList.length<10){
                           $scope.shwomor=false;
                       }
                       console.log(data);
                   }else{
                       $cordovaToast.showShortCenter(data.resultInfo);
                   }
               }).error(function(data,status,headers,config){
                   console.log(data);
                   $cordovaToast.showShortCenter('连接服务器失败啦!');
               });
               $scope.loadMores=function(){
                   $timeout( function() {
                       currPage=currPage+1;
                        var url=API.RWLIST+sion.hardId+'/'+sion.sessionId+"/"+sion.userId+'/'+index+'/'+currPage+'/'+pageSize;//获取url
                       //客户列表查询
                       console.log(url);
                       getServer.get(url).success(function(data,status,headers,config){
                           if(data.resultCode==1){
                               for(var i=0;i<data.taskList.length;i++){
                                   $scope.rwlist3.push(data.taskList[i]);
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
                           $cordovaToast.showShortCenter('连接服务器失败啦!');
                       });
                       $scope.$broadcast('scroll.infiniteScrollComplete');

                   }, 1000);

               }
           }else if(index==2){
               $scope.shwomor=true;
               var currPage=0;  //当前页数
               var pageSize=10; //每页条数
               currPage=currPage+1;
               var url=API.RWLIST+sion.hardId+'/'+sion.sessionId+"/"+sion.userId+'/'+index+'/'+currPage+'/'+pageSize;//获取url

               //客户列表查询
               getServer.get(url).success(function(data,status,headers,config){
                   if(data.resultCode==1){
                       $scope.rwlist2=data.taskList;
                       if(data.taskList.length<10){
                           $scope.shwomor=false;
                       }
                       console.log(data);
                   }else{
                       $cordovaToast.showShortCenter(data.resultInfo);
                   }
               }).error(function(data,status,headers,config){
                   console.log(data);
                   $cordovaToast.showShortCenter('连接服务器失败啦!');
               });
               $scope.loadMoresss=function(){
                   $timeout( function() {
                       currPage=currPage+1;
                       var url=API.RWLIST+sion.hardId+'/'+sion.sessionId+"/"+sion.userId+'/'+index+'/'+currPage+'/'+pageSize;//获取url
                       //客户列表查询
                       getServer.get(url).success(function(data,status,headers,config){
                           if(data.resultCode==1){
                               for(var i=0;i<data.taskList.length;i++){
                                   $scope.rwlist2.push(data.taskList[i]);
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
           }
       };


        $scope.edit=function(u){
            $ionicPopup.confirm({
                title: '确认',
                content: '是否完成此任务?',
                cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
                cancelType: '', // String (默认: 'button-default')。取消按钮的类型。
                okText: '确认', // String (默认: 'OK')。OK按钮的文字。
                okType: '' // String (默认: 'button-positive')。OK按钮的类型。
            }).then(function (res) {
                if (res) {
                  var url=API.WCRW;
                  var ps={'hardId':sion.hardId,'sessionId':sion.sessionId,'taskId':u,'taskStatus':2};
                    ps=angular.fromJson(ps);
                    postServer.post(url,ps).success(function(data,status,headers,config){
                        if(data.resultCode==1){
                            console.log(data);
                            $scope.onTabSelected(1);
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
//项目
.controller('xmController',['$scope','$cordovaToast','$state','$timeout','sessionService','getServer','$cordovaContacts', function($scope,$cordovaToast,$state,$timeout,sessionService,getServer,$cordovaContacts) {
        $scope.xzxm=function(){
            $state.go("addxm");
        };
        $scope.xmxq=function(u){
            $state.go("xmxq",{ids:u});
        };


        $scope.lxr=function(){
//            $cordovaContacts.clone().then(function(result) {
//                // Contact saved
//            }, function(err) {
//                // Contact error
//            });
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
            // alert($scope.khry);
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
            console.log(1+"---"+stsr+"--"+currPage);

        var url=API.KHLIST+sion.hardId+'/'+sion.sessionId+'/'+stsr+'/'+sion.areaCode+'/'+currPage+'/'+pageSize;//获取url
       //客户列表查询
        getServer.get(url).success(function(data,status,headers,config){
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
                var url=API.KHLIST+sion.hardId+'/'+sion.sessionId+'/'+stsr+'/'+sion.areaCode+'/'+currPage+'/'+pageSize;//获取url
                console.log(2+"---"+stsr+"--"+currPage);
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
           // alert($scope.khry);
            if(stsr==undefined){
                stsr=null;
            }else if(stsr==''){
                stsr=null;
            }
                var urls=API.KHLIST+sion.hardId+'/'+sion.sessionId+'/'+stsr+'/'+sion.areaCode+'/'+currPage+'/'+pageSize;//获取url
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

//待完成,已过期,完成
.controller('DashCtrl'['$scope', function($scope) {


}])
//我的同事
.controller('wdtsCtrl',['$scope','$cordovaToast','$state','$ionicHistory','sessionService','getServer', function($scope,$cordovaToast,$state,$ionicHistory,sessionService,getServer) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }
        var sion=sessionService.getsession();//获取缓存数据
        var url=API.BMLIST+sion.hardId+"/"+sion.sessionId+'/'+sion.departId+'/'+sion.areaCode;
        getServer.get(url).success(function(data,status,headers,config){
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
                //console.log(u);
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
 .controller('addkhCtrl',['$scope','$cordovaToast','postServer','sessionService','$ionicHistory','$ionicModal','$cordovaContacts', function($scope,$cordovaToast,postServer,sessionService,$ionicHistory,$ionicModal,$cordovaContacts) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }
        var sion=sessionService.getsession();//获取缓存数据
        $scope.kh={
            'hardId':sion.hardId,
            'sessionId':sion.sessionId,
            'customerName':'',
            'customerPhone':'',
            'unitName':'',
            'customerJob':'',
            'unitAddress':'',
            'userId':sion.userId,
            'areaCode':sion.areaCode
        }

        $scope.reqister=function(kh){
            console.log(kh);
            var url=API.ADDKH;
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
    .controller('addxmCtrl',['$scope','$ionicHistory','postServer','sessionService','$cordovaToast', function($scope,$ionicHistory,postServer,sessionService,$cordovaToast) {
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
            'areaCode':sion.areaCode //区域id

            }
        var url=API.ADDXM;

        $scope.reqister=function(xm){
            console.log(xm);
            postServer.post(url,xm).success(function(data,status,headers,config){
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
//项目详情
    .controller('xmxqCtrl',['$scope','$ionicPopup','$cordovaToast','$ionicHistory','$ionicModal','postServer','sessionService','$stateParams','getServer', function($scope,$ionicPopup,$cordovaToast,$ionicHistory,$ionicModal,postServer,sessionService,$stateParams,getServer) {
        $scope.goBack=function(){
            $ionicHistory.goBack();
        }
        $scope.spzt={};
        $scope.ysp={};
        $scope.sfbh={};
        var projectsId=undefined;
        var ids=$stateParams.ids;
        var sion=sessionService.getsession();//获取缓存数据
        var url=API.XMXQ+sion.hardId+'/'+sion.sessionId+'/'+ids;
        getServer.get(url).success(function(data,status,headers,config){
            if(data.resultCode==1){
                if(data.addProject.projectType==1){
                    $scope.ysp=true;
                    $scope.sfbh=false;
                    $scope.spzt=true;
                }else{
                    $scope.sfbh=true;
                    $scope.ysp=false;
                }
                $scope.x=data.addProject;
                console.log(data);
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
                    postServer.post(urlss,tr).success(function(data,status,headers,config){
                        if(data.resultCode==1){
                            console.log(data);
                            $scope.ysp=true;
                            $scope.sfbh=false;
                            $scope.spzt=true;
                            $scope.newReplieModal.hide();
                            strid=undefined;
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
                  //  $ionicHistory.clearCache();
//                    var url=API.TCDL;
//                    var sion=sessionService.getsession();//获取缓存数据
//                    var da={
//                        'hardId':sion.hardId,
//                        'sessionId':sion.sessionId,
//                        'userId':sion.userId
//                    }
//                    da=angular.fromJson(da);
//                    postServer.post(url,da).success(function(data,status,headers,config){
//                        if(data.resultCode==1){
                           var cach=$cacheFactory.get('cacheId');
                               // cach.remove('sion');
                                cach.removeAll();
                            $state.go("login");
                            console.log(cach.get('sion'));
//                        }else{
//                            $cordovaToast.showShortCenter(data.resultInfo);
//                        }
//                    }).error(function(data,status,headers,config){
//                        $cordovaToast.showShortCenter('连接服务器失败啦!');
//                    });
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
        var sion=sessionService.getsession();//获取缓存数据
        $scope.tlk={taskDesc:'',completeDate:'','relationProject':'','hardId':sion.hardId,'sessionId':sion.sessionId,'userId':sion.userId};

        $scope.reqister=function(u){
            var d1=u.completeDate;
            var d2=new Date();//取今天的日期
             if(d1<d2){
                 $cordovaToast.showShortCenter("完成时间必须大于今天");
                 return false;
             }
          var  date = $filter('date')(d1, "yyyy-MM-dd");
            u.completeDate=date;

            var url=API.ADDRW;
            postServer.post(url,u).success(function(data,status,headers,config){
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


            // 触发一个按钮点击，或一些其他目标
         //   $scope.showPopup = function () {

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
            if(data.resultCode==1){
                //$scope.khlist=data.custList;
                $scope.kh=data.cust;
                console.log($scope.kh);
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
            var obj=angular.extend({}, ks, pst);
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
               // alert('请输入正确的手机号码');
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

    }])





;
