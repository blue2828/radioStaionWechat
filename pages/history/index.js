// pages/history/index.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    audioInfo: [],
    showCheck: false,
    showBtns: false,
    changeSelectV: '全选',
    selectedItems: []
  },
  doLongPress: function () {
    this.setData({
      showCheck: true,
      showBtns: true
    });
  },
  changeSelectV: function (e) {
    var that = this;
    let changeSelectV = e.currentTarget.dataset.btnname;
    changeSelectV = changeSelectV == null || changeSelectV == undefined || changeSelectV == '' ? 
      e.target.dataset.btnname : changeSelectV;
    switch (changeSelectV) {
      case "全选" :
        let tempAudioInfo = that.data.audioInfo;
        tempAudioInfo = tempAudioInfo.filter((value, index, arr) => {
          value['checked'] = true;
          return arr;
        });
        
        that.setData({
          changeSelectV: "取消全选",
          audioInfo: tempAudioInfo,
          selectedItems: tempAudioInfo
        });
        break;
      default :
        let tempAudioInfo2 = that.data.audioInfo;
        tempAudioInfo2 = tempAudioInfo2.filter((value, index, arr) => {
          value['checked'] = false;
          return arr;
        });
        that.setData({
          changeSelectV: "全选",
          audioInfo: tempAudioInfo2,
          selectedItems: []
        });
    }
  },
  cancelOp: function () {
    let tempAudioInfo3 = this.data.audioInfo;
    tempAudioInfo3 = tempAudioInfo3.filter((value, index, arr) => {
      value['checked'] = false;
      return arr;
    });
    this.setData({
      showCheck: false,
      showBtns: false,
      changeSelectV: "全选",
      audioInfo: tempAudioInfo3,
      selectedItems: []
    });
  },
  checkChange: function (e) {
    this.setData({
      selectedItems: e.detail.value
    });
  } ,
  delList: function () {
    let selectedItems = this.data.selectedItems;
    var that = this;
    if (selectedItems.length == 0) {
      wx.showToast({
        title: "请选择需要删除的记录",
        icon: 'none'
      });
      return;
    }
    let idArr = [];
    selectedItems.forEach((value, index, arr) => {
      idArr.push(value.id == undefined ? value : value.id);
    });
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          let urlAndPort = util.httpUrlAndPort();
          wx.request({
            url: `${urlAndPort}/wechat/delSelfHistory`,
            data: { id: idArr.join(",") },
            dataType: 'json',
            success: function (res) {
              switch (res.data.success) {
                case true:
                  wx.showToast({
                    title: '删除成功',
                    duration: 2000
                  });
                  that.loadData();
                  break;
                default:
                  wx.showToast({
                    title: '删除失败',
                    icon: 'none',
                    duration: 2000
                  });
              }
            },
            fail: function (res) {
              wx.showToast({
                title: '网络不通或服务器出错',
                icon: 'none'
              });
            }
          });
        }
      }
    })
  } ,   
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
  loadData: function () {
    var _self = this;
    let urlAndPort = util.httpUrlAndPort();
    wx.request({
      url: urlAndPort + '/getListetnHistory',
      success: function (res) {
        let info = res.data.list;
        info.filter((value, index, arr) => {
          value['targetFile'] = `${urlAndPort}/pushRecordStreamByName?fileName=${value.targetFile}`;
          value['checked'] = false;
        });
        _self.setData({
          audioInfo: info
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadData();
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