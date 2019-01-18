// pages/tabThree/more/index.js
var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _self = this;
    var member = app.globalData.memberInfo.currentWxMember;
    wx.request({
      url: util.httpUrlAndPort() + '/getMemberInfo',
      data: { id: member.id },
      success: function (res) {
        _self.setData({
          userInfo: {
            gender: res.data.data[0].sex,
            label: res.data.data[0].label == '' || res.data.data[0].label == null ? '这家伙很懒,什么也没留下' : res.data.data[0].label,
            birthday: res.data.data[0].birthday == '' || res.data.data[0].birthday == null ? '未设置生日' : res.data.data[0].birthday
          }
        });
      }
    });
   
       
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