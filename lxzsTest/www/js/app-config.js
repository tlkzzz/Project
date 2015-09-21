/**
 * Created by asus on 2015/8/12.
 */


/**
 * 默认程序设置
  * @type {string}
 */
var SETING={
    version: '0.0.3'
}


var PINGJ={
 hardId:'',//系统版本号
 system:'',//操作系统
 phoneType:''//手机类型
}





//主机地址
var API_HOST = 'http://aikong.f3322.net:9191/lxzsNew/';
//var API_HOST = 'http://aikong.vicp.net:9191/lxzs/';
//var API_HOST = 'http://192.168.10.45:8080/lxzs/';
var API = {
    /**
     * 登陆方法
     */
    LOGIN:API_HOST+'api/rest/admin/login',
    /**
     * 客户列表分页查询
     */
    KHLIST:API_HOST+"api/rest/customer/queryCustomerList/",
    /**
     * 客户个人详情
     */
    KHGRXX:API_HOST+"api/rest/customer/queryCustomer/",
    /**
     * 修改客户信息
     */
    EDITKHXX:API_HOST+"api/rest/customer/updateCustomer",
    /**
     * 删除客户
     */
    DELKH:API_HOST+"api/rest/customer/deleteCustomer",
    /**
     * 新增客户
     */
    ADDKH:API_HOST+"api/rest/customer/addCustomer",
    /**
     * 部门
     */
    BMLIST:API_HOST+"api/rest/admin/departList/",
    /**
     * 部门人员列表
     */
    BMRYLIST:API_HOST+"api/rest/admin/departUserList/",
    /**
     * 修改密码
     */
    XGMM:API_HOST+"api/rest/admin/config/updatePassword",

    /**
     * 项目列表
     */
    XMLIST:API_HOST+"api/rest/projects/queryProjrctsList/",
    /**
     * 项目详情
     */
    XMXQ:API_HOST+"api/rest/projects/queryProjects/",
    /**
     * 查询人员列表
     */
    ADDZPR:API_HOST+"api/rest/projects/querySalePerson/",
    /**
     * 添加项目
     */
    ADDXM:API_HOST+"api/rest/projects/addProjects",
    /**
     * 项目指派人
     */
    XMZPR:API_HOST+"api/rest/projects/approvalProjects",
    /**
     * 添加任务
     */
    ADDRW:API_HOST+"api/rest/task/addTask",
    /**
     * 添加任务时指派任务
     */
    ZPRWLIST:API_HOST+"api/rest/task/queryProjectList/",

    /**
     * 任务查询
     */
    RWLIST:API_HOST+"api/rest/task/queryTaskList/",
    /**
     * 完成任务
     */
    WCRW:API_HOST+"api/rest/task/completeTask",
    /**
     * 获取验证码
     */
    HQYZM:API_HOST+"api/rest/admin/getUpdatePswCode",

    /**
     * 确认新密码
     */
    QRXMM:API_HOST+"api/rest/admin/commitUpdatePswCode",

    /**
     * 退出登陆
     */
    TCDL:API_HOST+"api/rest/admin/loginout",
    /**
     * APP更新
     */
    APPUPDATE:API_HOST+"api/rest/admin/newVersion/",

    /**
     * 下载app地址
     */
    XZAPPURL:API_HOST
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