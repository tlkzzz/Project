// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','starter.filter'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {


        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('standard');

        $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.navBar.alignTitle('left');

        $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
        $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

        $ionicConfigProvider.platform.ios.views.transition('ios');
        $ionicConfigProvider.platform.android.views.transition('android');
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

      // setup an abstract state for the tabs directive
      //配置父类路由 让其下面的子类都有底部tab选项卡
      .state('tab', { //定义一个父类tab
          url: "/tab",   //让其支持herf方式跳转
          abstract: true,  //让其有父子状态关系
          templateUrl: "templates/tabs.html"
      })

      // Each tab has its own nav history stack:

      .state('tab.rw', { //继承父类tab
          url: '/rw',   //让其支持herf方式跳转
          views: {       //子类显示的view
              'tab-rw': {  //tabs中view 的name  下面的html模板显示在tab-dash中
                  templateUrl: 'templates/tab-rw.html',  //显示的模板html
                  controller: 'rwController'   //控制层方法
              }
          }
      })

      .state('tab.kh', {
          url: '/kh',
          views: {
              'tab-kh': {
                  templateUrl: 'templates/tab-kh.html',
                  controller: 'khController'  //这里定义了controller就不需要在视图view中重新定义controller
              }
          }
      })
      .state('tab.xm', {
          url: '/xm',
          views: {
              'tab-xm': {
                  templateUrl: 'templates/tab-xm.html',
                  controller: 'xmController'  //这里定义了controller就不需要在视图view中重新定义controller
              }
          }
      })
      .state('tab.wd', {
          url: '/wd',
          views: {
              'tab-wd': {
                  templateUrl: 'templates/tab-wd.html',
                  controller: 'wdController'
              }
          }
      })
      .state('tab.rw.unfinished', {
          url: '/unfinished',
          views: {
              'tab-rw-unfinished': {
                  templateUrl: 'templates/tab-rw-unfinished.html'
               //   controller: 'DashCtrl'
              }
          }
      })
      .state('tab.rw.outdated', {
          url: '/outdated',
          views: {
              'tab-rw-outdated': {
                  templateUrl: 'templates/tab-rw-outdated.html'
                 // controller: 'DashCtrl'
              }
          }
      })
      .state('tab.rw.finished', {
          url: '/finished',
          views: {
              'tab-rw-finished': {
                  templateUrl: 'templates/tab-rw-finished.html'
                //  controller: 'DashCtrl'
              }
          }
      })
//      .state('tab.ss', {  //ss这个可以随便取与herf中的地址没有关系
//          url: '/chats/:chatId',
//          views: {
//              'tab-chats': {
//                  templateUrl: 'templates/chat-detail.html',
//                  controller: 'ChatDetailCtrl'
//              }
//          }
//      })

            .state('wdts', {
                url: '/wdts',
                templateUrl: 'templates/wd-ts.html',
                controller: 'wdtsCtrl'

            })
      .state('bm', {
          url: '/bm',
          templateUrl: 'templates/wd-ts-bm.html',
          controller: 'bmCtrl'

      })
      .state('addkh', {  //新增客户
          url: '/addkh',
          templateUrl: 'templates/kh-add.html',
          controller: 'addkhCtrl'

      })

        .state('khxx', { //客户信息
            url: '/khxx',
            templateUrl: 'templates/kh-khxx.html',
            controller: 'khxxtCtrl'

        })
      .state('addxm', { //项目新增 项目报备
          url: '/addxm',
          templateUrl: 'templates/xm-add.html',
          controller: 'addxmCtrl'

      })
      .state('xmxq', { //项目详情
          url: '/xmxq',
          templateUrl: 'templates/xm-xq.html',
          controller: 'xmxqCtrl'

      })
      .state('wdxx', { //我的消息
          url: '/wdxx',
          templateUrl: 'templates/wd-xiaoxi.html',
          controller: 'wdxxCtrl'

      })
      .state('wdsz', { //我的设置
          url: '/wdsz',
          templateUrl: 'templates/wd-sz.html',
          controller: 'wdszCtrl'

      })
      .state('addrw', { //新增任务
          url: '/addrw',
          templateUrl: 'templates/rw-add.html',
          controller: 'addrwCtrl'
      })
      .state('xgmm', { //修改密码
          url: '/xgmm',
          templateUrl: 'templates/sz-xgmm.html',
          controller: 'xgmmCtrl'
      })
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/rw');

});
