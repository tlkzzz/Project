/**
 * Created by asus on 2015/8/12.
 */


/**
 * 默认程序设置
  * @type {string}
 */
var SETING={
    version: '0.0.1'
}


var PINGJ={
 hardId:'',//系统版本号
 system:'',//操作系统
 phoneType:''//手机类型
}



var USER={
    sessionId:'',//会话id
    userId:'',//用户id
    userName:'',//用户名称
    sex:''//用户性别
}




//主机地址
var API_HOST = 'http://192.168.10.29:8080/lxzs/api/rest/';

var API = {
    /**
     * 登陆方法
     */
    LOGIN:API_HOST+'admin/login',
    /**
     * 客户列表分页查询
     */
    KHLIST:API_HOST+"customer/queryCustomerList/"

}

/**
 * 返回成功提示信息
 * @type {{}}
 */
var RTSUCCESS={

}

/**
 * 返回错误提示信息
 */
var RTERROR={

}

/**
 * 提示信息
 */
var ALERTMSG={
    ZAYCTCCX:'再按一次退出系统'
}