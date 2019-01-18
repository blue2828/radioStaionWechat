//app.js
var util = require("utils/util.js");
util.initSocket();
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        if (res.code) {
         wx.request({
           url: util.httpUrlAndPort() + '/onWxLogin',
           data: {code: res.code, isApp: 0},
           success: result => {
             if (result.data.success) {
               wx.setStorageSync("currentWxMember", result.data.currentWxMember);
               wx.setStorageSync("cookie_id", 'JSESSIONID=' + result.data.cookie_id);
                 this.globalData.memberInfo = {                  
                   "currentWxMember": result.data.currentWxMember,
                   "session_key": result.data.session_key
                 };
             }else {
               this.globalData.memberInfo = {
                 "currentWxMember": undefined
               };
                wx.showToast({
                  title: result.errMsg,
                  icon: 'none'
                });
             }
           },
           fail: e => {
             this.globalData.memberInfo = {
               "currentWxMember": undefined
             };
             wx.showToast({
               title: '网络不通或者服务器出错',
               icon: 'none'
             })
           }
         });
        }else {
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          });
        }
        
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //console.log(res.code);
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({  
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res) 
              }
            }
          })
        }
      }
    })
  },
  addListener: function (callback) {
    this.callback = callback;
  },

  setChangedData: function (castInfo) {
    this.castInfo = castInfo;
    this.source = source;
    if (this.callback != null) {
      this.callback(castInfo);
    }
  },
  globalData: {
    userInfo: null
  }
})