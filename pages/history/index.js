// pages/history/index.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    audioInfo: {},
    srcHeader: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _self = this;
    //let innerAudioContext = wx.createInnerAudioContext();
    


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _self = this;

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _self = this;
    wx.request({
      url: util.httpUrlAndPort() + '/getListetnHistory',
      success: function (res) {
        let info = res.data.list;
        _self.setData({
          audioInfo: info,
          srcHeader: util.httpUrlAndPort().concat('/').concat('readRecord?listenHistoryId=')
        });
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