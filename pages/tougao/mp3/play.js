// pages/tougao/mp3/play.js
var audioContext = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    bgImg: '../../images/musicBg.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var info = wx.getStorageSync('songInfo');
    var that = this;
    that.setData({
      info: info.info
    });
    
      
   
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { 
    this.audioContext = wx.createAudioContext('myAudio');
    this.audioContext.play();
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
    this.audioContext.stop();
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