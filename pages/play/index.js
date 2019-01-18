
var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLive: -1,
    author: '',
    name: '',
    source: '',
    bgImg: '../images/musicBg.jpg',
    recordList: [],
    castInfo: {}
  },
  tapRecord: function (e) { //listenType 收听类型 0: 录音 1:直播
    let info = e.currentTarget.dataset.selectedinfo;
    this.doUpdateListen(0, info);
  },
  tapAudio: function (e) {
    let info = e.currentTarget.dataset.selectedinfo;
    info['storeAddr'] = this.data.source;
    info['memberId'] = this.data.castInfo.memberId;
    this.doUpdateListen(1, info);
  },
  doUpdateListen: function (type, info) {
    let urlAndPort = util.httpUrlAndPort();
    info["targetFile"] = info.storeAddr.substring(info.storeAddr.lastIndexOf('=') + 1);
    info["listenType"] = type;
    wx.request({
      url: `${urlAndPort}/wechat/saveListen`,
      data: info,
      header: {'Cookie': wx.getStorageSync("cookie_id")},
      dataType: 'json',
      success: function (res) {
        switch (res.data.success) {
          case true :
            console.log('保存收听历史成功');
            break;
            default :
            console.log("保存收听历史失败");
        }
      }
    });
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
  onMessage: function (res) {
    var that = this;
    console.log(res);
    switch (res.indexOf("开播") > -1) {
      case true :
        wx.showModal({
          title: '提示',
          content: '学院广播电台已开播'
        });
        wx.request({
          url: util.httpUrlAndPort() + "/getCurrentCastInfo",
          dataType: 'json',
          header: { "Cookie": wx.getStorageSync('cookie_id') },
          success: function (res) {
            if (res.data.result != null) {
              var result = res.data.result[0];
              that.setData({
                author: result.lastTimeMemberId,
                name: result.name,
                isLive: 0,
                castInfo: result
              });
            } else {
              that.setData({
                name: '学院广播电台'
              });
            }
          },
          fail: function () {
            console.log("请求服务器出错");
          }
        });
        break;
    }
      if (res.indexOf(".amr") > -1) {
        that.setData({
          source: util.httpUrlAndPort() + "/pushRecordStreamByName?fileName=" + res.split("||")[0]
        });
      }
  },
  onShow: function () {
    app.addListener(function (result) {
      switch (result.indexOf(".amr") > -1) {
        case true:
          that.setData({
            source: result
          });
          break;
        default:
          that.setData({
            author: result.lastTimeMemberId,
            name: result.name,
            isLive: 0,
            castInfo: result
          });
      }

    });
    var that = this;
    util.getMessage(this);
    let urlAndPort = util.httpUrlAndPort();
    wx.request({
      url: `${urlAndPort}/getAllRecordList`,
      dataType: 'json',
      header: { "Cookie": wx.getStorageSync('cookie_id') },
      success: function (res) {
        let recordList = res.data.recordList;
        switch (recordList == null) {
          case true :
            that.setData({
              recordList: []
            });
            break;
          default:
            let arr = recordList.filter((value, index, arr) => {
              value.storeAddr = `${urlAndPort}/pushRecordStreamByName?fileName=${value.storeAddr}`;
              value['createTime'] = new Date(value['createTime']).toLocaleString();
              return arr;
            });
            that.setData({
              recordList: arr
            });
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '获取录音列表失败',
          icon: 'none'
        })
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