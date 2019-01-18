
var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selfInfo: {},
    items: [],
    inputVal: '',
    anotherObjHeader: ''
  },

  inputChange: function (e) {
    this.setData({
      inputVal: e.detail.value
    })
  },
  confirmClearChat: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是要清屏吗',
      success: function (res) {
        if (res.confirm) {
          that.setData({
            items: []
          });
        }
      }
    })
  },
  doSend: function () {
    let newItem = this.data.items;
    let obj = {'chatContent': this.data.inputVal, 'isWx': true, "wxMemId": this.data.selfInfo.id};
    newItem.push(obj);
    this.setData({
      items: newItem
    });
    obj = {chat: obj}; 
    util.sendMessage(JSON.stringify(obj));
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

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
    util.getMessage(this);
    util.getUserInfo();
    util.getUserImage();
    let imgBase64 = wx.getStorageSync("imageHeaderAddr");
    let currentWxMember = wx.getStorageSync("currentWxMember");
    currentWxMember.imageHeaderAddr = `data:image/png;base64,${imgBase64}`;
    this.setData({
      selfInfo: currentWxMember
    });
  },
  onMessage: function (res) {
    let _self = this;
    console.log(res);
    if (res.indexOf("chat") > -1) {
      res = JSON.parse(res).chat;
      switch (!res.isWx) {
        case true :
          wx.request({
            url: `${util.httpUrlAndPort()}/getMemberImg`,
            data: { memberId: res.appMemId},
            dataType: 'json',
            success: function (result) {
              _self.setData({
                anotherObjHeader: `data:images/png;base64,${result.data}`
              });
            },
            fail: function () {
              wx.showToast({
                title: '网络请求失败',
                icon: 'none'
              });
            }
          });
          let newOne = _self.data.items;
          newOne.push(res);
          _self.setData({
            items: newOne
          });
          break;
      }
    }
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