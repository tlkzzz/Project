angular.module('starter.services', [])

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

//任务服务
.factory('rwServer', function() {

}
);
