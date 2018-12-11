// pages/tabThree/index.js
var app = getApp();
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blockImg : {},
    wxInfo : {},
    fieldColor: "",
    memberInfo : {},  
    isLogin: false,
    userInfoHeight: "",
    session_key: "",
    imageHeader: "",
    label: "",
    nickName: ''
  },
  listenHistory : function () {
    wx.navigateTo({
      url: '../history/index'
    });
  },
  demandHistory: function () {
    wx.navigateTo({
      url: '../history/demand/index'
    });
  },
  viewUserInfo: function () {
    wx.navigateTo({
      url: 'userInfo'
    })
  },
  editInfo: function () {
    wx.navigateTo({
      url: 'editInfo/index'
    })
  },
  doLogin : function (remoteKey) {
    var _self = this;
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: util.httpUrlAndPort() + '/onWxLogin',
            data: { code: res.code, remoteKey: remoteKey, isApp: 0},
            success: result => {
              if (result.data.success) {
                _self.setData({
                  isLogin: true,
                  memberInfo: result.data.currentWxMember,
                  userInfoHeight: '160rpx',
                  session_key: result.data.session_key,
                });
                let tempLabel = _self.data.memberInfo.label == '' || _self.data.memberInfo.label == null || _self.data.memberInfo.label == undefined ? '这家伙很懒，什么也没留下' : _self.data.memberInfo.label;
                _self.setData({
                  label: tempLabel
                });
                let tempNickName = _self.data.memberInfo.nickName
                tempNickName = tempNickName.length > 16 ? tempNickName.substring(0, 16) + '...' : tempNickName;
                _self.setData({
                  nickName: tempNickName
                });
                app.globalData.memberInfo = {
                  "currentWxMember": result.data.currentWxMember,
                  "session_key": result.data.session_key
                };
                wx.request({
                  url: util.httpUrlAndPort() + '/getMemberImg',
                  data: { memberId: _self.data.memberInfo.id},
                  success: function (res) {
                    _self.setData({
                      imageHeader: "data:image/png;base64," + res.data
                    });
                    app.globalData.memberInfo.currentWxMember.imageHeaderAddr = "data:image/png;base64," + res.data;
                  }
                });
              } else {
                _self.setData({
                  isLogin: false,
                  memberInfo: null,
                  userInfoHeight: '310rpx',
                  session_key: null
                });
                wx.showToast({
                  title: result.errMsg,
                  icon: 'none'
                });
              }
            },
            fail: e => {
              wx.showToast({
                title: '网络不通或者服务器出错',
                icon: 'none'
              })
            }
          });
        } else {
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          });
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _self = this;
    _self.setData({
      blockImg: { listen: 'images/listen.png', 
      history: 'images/history.png', 
      setting: 'images/setting.png' } 
    });
    let currentWxMember = app.globalData.memberInfo;
    if (currentWxMember == undefined || currentWxMember == null) {
      _self.setData({
        isLogin: false,
        userInfoHeight: '310rpx'
      });
    }else {
      let key = app.globalData.memberInfo.session_key;
      if (key == undefined) {
        wx.showToast({
          title: '非法登录',
          icon: 'none'
        });
        _self.setData({
          isLogin: false,
          userInfoHeight: '310rpx'
        });
      }else {
        _self.doLogin(key);
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _self = this;
    var member = app.globalData.memberInfo.currentWxMember;
    wx.request({
      url: util.httpUrlAndPort() + '/getMemberInfo',
      data: { id: member.id },
      success: function (res){
        wx.setStorageSync('currentWxMember', res.data.data);
        _self.setData({
          nickName: res.data.data[0].nickName.length > 16 ? res.data.data[0].nickName.substring(0, 16) + '...' : res.data.data[0].nickName,
          label: res.data.data[0].label == '' || res.data.data[0].label == null ? '这家伙很懒，什么也没留下' : res.data.data[0].label
        });
        app.globalData.memberInfo.currentWxMember = res.data.data[0];
      }
    });
    wx.request({
      url: util.httpUrlAndPort() + '/getMemberImg',
      data: { memberId: member.id },
      success: function (res) {
        _self.setData({
          imageHeader: 'data:image/png;base64,' + res.data
        });
        app.globalData.memberInfo.currentWxMember.imageHeaderAddr = _self.data.imageHeader;
      }
    });

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})