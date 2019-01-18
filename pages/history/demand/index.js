// pages/history/index.js
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    demandList: []
  },

  previewDemand: function (e) {
    let info = e.currentTarget.dataset.info == undefined || e.currentTarget.dataset.info == null || e.currentTarget.dataset.info.length <= 0 ? e.target.dataset.info : e.currentTarget.dataset.info;
    let imgsrc = e.currentTarget.dataset.imgsrc == undefined || e.currentTarget.dataset.imgsrc == null || e.currentTarget.dataset.imgsrc.length <= 0 ? e.target.dataset.imgsrc : e.currentTarget.dataset.imgsrc;
    var url = 'preview?imgsrc=' + imgsrc  + '&info=' + JSON.stringify(info);
    wx.navigateTo({
      url: url
    });
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _self = this;
   



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
    var that = this;
    wx.request({
      url: util.httpUrlAndPort() + "/getSelfDemand",
      header: {"Cookie" : wx.getStorageSync('cookie_id')},
      dataType: 'json',
      success: function (res) {
        let list = res.data.demandList;
        
        list.forEach((value, index) => {
          switch (value.type) {
            case '文章' :
              var lastLetter = value.storeAddr.substring(value.storeAddr.lastIndexOf('.') + 1);
              switch (lastLetter) {
                case 'pdf' :
                  value['typeImg'] = '../../images/file-pdf.png';
                  break;
                case 'txt' :
                  value['typeImg'] = '../../images/file-text.png';
                  break;
              }
              break;
            default:
              value['typeImg'] = '../../images/customerservice.png';
          }
        });
        list.length > 0 ?
        that.setData({
          demandList: res.data.demandList
        }) :
        wx.showToast({
          title: '暂无点播历史',
          icon: 'none'
        });

      },
      fail: function (res) {
        wx.showToast({
          title: '服务器请求失败',
          icon: 'none'
        });
      }
    })
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