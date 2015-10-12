angular.module('starter.services', [])
//http拦截
.factory('httpInterceptor', function() {
       return{
           request: function(config){
               if(config.data && typeof config.data == "object"){

                  config.data =$.param(config.data);
               }

               return config;
           }

    }
    })




//session 缓存
    .factory('sessionService',function($cacheFactory){
        return{
            addsession:function(sion){
                var cache=$cacheFactory.get('cacheId');
                if(cache==undefined){
                    cache=$cacheFactory('cacheId');  //设置一个缓存id,其他controller中就可以直接使用
                    cache.put('sion',sion);
                    console.log(cache.get('sion'));
                }else{
                    cache.put('sion',sion);
                }
            },
            getsession:function(){//取缓存
               var cache=$cacheFactory.get('cacheId');  //取缓存id
               return cache.get('sion');
//                return  window.localStorage.getItem('sion');
            }

        }

    })





//html缓存密码
.factory('localStorageServices',function(){
     return{
       addMm:function(user,pass,check){
           window.localStorage.setItem("user",user);//设置用户名
           window.localStorage.setItem("pass",pass);//设置密码
           window.localStorage.setItem("check",check);//是否保存密码
       },
       getUser:function(user){
           return  window.localStorage.getItem(user);//获取用户名
       },
       getPass:function(pass){
           return  window.localStorage.getItem(pass);//获取密码
       },
       getCheck:function(check){
           return  window.localStorage.getItem(check);//是否保存密码
       },
       delAll:function(){//清除所有的html5缓存
           window.localStorage.clear();
       }
     }
})



//get请求
    .factory('getServer',function($http){
        return {
            get:function(url){
                return $http.get(url);
            }
        }
})

//post请求
    .factory('postServer',function($http){
        return {
            post:function(url,params){
                return $http.post(url,params);
            }
        }
    })

//检查更新
    .factory('appUpdateServer',function($http,$cordovaAppVersion,$cordovaDevice){
        return {
            appUpdate:function(){
                var versi=SETING.version;//获取版本号

                //var url=API.APPUPDATE+"yyx"+'/'+"ios"+'/'+versi;
               var url=API.APPUPDATE+$cordovaDevice.getUUID()+'/'+$cordovaDevice.getPlatform()+'/'+versi;
                return $http.get(url);
            }
        }

    })


;
