// pages/tabThree/userInfo.js
var app = getApp();
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageHeader: '',
    memberInfo: {},
    blockHeight: '',
    lineHeight: ''
  },
  showMore: function () {
    wx.navigateTo({
      url: 'more/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _self = this;
    util.getUserInfo();
    var currentMember = wx.getStorageSync('currentWxMember')[0] == null ||
      wx.getStorageSync('currentWxMember')[0] == undefined ? wx.getStorageSync('currentWxMember') :
      wx.getStorageSync('currentWxMember')[0];
    util.getUserImage();
    var img = wx.getStorageSync('imageHeaderAddr');
    _self.setData({
      imageHeader: 'data:image/png;base64,' + img,
      memberInfo: {
        'nickName': currentMember.nickName,
        'name': currentMember.userName
      }
    });
    util.get
    var member = app.globalData.memberInfo.currentWxMember;
    _self.setData({
      blockHeight: '520rpx',
      lineHeight: '5rpx'
    });
    member.nickName.length > 20 ? 
    _self.setData({
        blockHeight: 520 + Math.floor(member.nickName.length / 20) * 60 + (member.nickName.length % 20 == 0 ? 0 : 100) + 'rpx',
        lineHeight: 520 + Math.floor(member.nickName.length / 20) * 60 + (member.nickName.length % 20 == 0 ? 0 : 100)  - 520 > 200 ? '200rpx' : '5rpx'
    }) : undefined;
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