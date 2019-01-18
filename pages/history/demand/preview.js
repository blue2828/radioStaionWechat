var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prewData: {},
    doplay_url: '',
    imgSrc: ''
  },
  prewText: function (e) {
    let fileId = e.target.dataset.fileid;
    let fileId2 = e.currentTarget.dataset.fileid;
    fileId = fileId == '' || fileId == undefined || fileId == null ? fileId2 : fileId;
    wx.navigateTo({
      url: 'webview?imgsrc=' + this.data.imgSrc + '&fileid=' + fileId
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let info = JSON.parse(options.info);
    let imgsrc = options.imgsrc;
    var that = this;
    that.setData({
      prewData: info,
      imgSrc: imgsrc
    });
    switch (info.type) {
      case '歌曲' :
        switch (info.play_url) {
          case "" :
            wx.request({
              url: util.httpUrlAndPort() + "/getFileIdByAddr?storeAddr=" + info.storeAddr,
              header: { 'Cookie': wx.getStorageSync('cookie_id')},
              success: function (res) {
                if (res.data.url != '' && res.data.url != undefined && res.data.url != null) {
                  that.setData({
                    doplay_url: util.httpUrlAndPort() + '/previewFile?isMusic=true&fileId=' + res.data.url
                  });
                }
              },
              fail: function (res) {
                wx.showToast({
                  title: '请求服务器失败',
                  icon: 'none'
                })
              }
            });
              break;
              default :
                that.setData({
                  doplay_url: info.play_url
                });
        }
        break;
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