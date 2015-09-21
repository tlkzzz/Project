/**
 * Created by asus on 2015/7/7.
 */
angular.module('starter.filter', [])
 .filter('fromNow', function($window){
//        return function(date){
//            //   console.log(date);
//            return $window.moment(date).fromNow();
//        }
    })


 .filter('strJq',function(){
        return function(a){  //a是获取的值  截取字符串 过滤器
            var k='';
              if(a.length>10){
              k=a.substr(0,14)+".....";
              }else{
                k=a;
              }
            return k;
        }
    })