// pages/my/sendtome/index.js
var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  pullup: function (e) {
    let demandId = e.currentTarget.dataset.demandid;
    let fileType = e.currentTarget.dataset.filetype;
    let that = this;
    if (fileType == '歌曲') {
      let info = this.data.list;
      info = info.filter((val, index, arr) => {
        if (val.d_id == demandId) {
          val.doShow = false;
        }
        return arr;
      });
      that.setData({
        list: info
      });
    }
  },
  preview: function (e) {
    let fileType = e.currentTarget.dataset.filetype;
    let demandId = e.currentTarget.dataset.demandid;
    let fileid = e.currentTarget.dataset.fileid;
    let imgsrc = e.currentTarget.dataset.img;
    let that = this;
    if (fileType == '歌曲') {
      let info = this.data.list;
      info = info.filter((val, index, arr) => {
        if (val.d_id == demandId) {
          val.doShow = true;
        }
        return arr;
      });
      that.setData({
        list: info
      });
      this.audioContext2.play();
    }else {
      wx.navigateTo({
        url: 'previewtext?imgsrc=' + imgsrc + '&fileid=' + fileid
      })
      
    }
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.audioContext = wx.createAudioContext('myAudio', this);
    this.audioContext2 = wx.createAudioContext('myAudio2', this);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    let currentMember = wx.getStorageSync('currentWxMember');
    let memberId = Array.isArray(currentMember) ? currentMember[0].id : currentMember.id;
    wx.request({
      url: `${util.httpUrlAndPort()}/wx/getDemandToMe`,
      header: {'Cookie': wx.getStorageSync('cookie_id')},
      data: { memberId: memberId},
      success: function (res) {
        let list = res.data.list;
        if (list.length != 0) {
          list = list.filter((value, index, arr) => {
            switch (value.fileType) {
              case '歌曲' :
                if (value.storeAddr == '')
                  value.storeAddr = value.play_url;
                else
                  value.storeAddr = `${util.httpUrlAndPort()}/previewFile?fileId=${value.file_id}`;
                value.img = '../../images/customerservice.png';
                break;
              case '文章' :
                  if (value.storeAddr != '')
                    value.img = value.storeAddr.endsWith('.pdf') ? '../../images/file-pdf.png' :
                      '../../images/file-text.png';
                break;
            }
            if (value.r_storeAddr != '')
              value.r_storeAddr = `${util.httpUrlAndPort()}/pushRecordStreamByName?fileName=${value.r_storeAddr}`;
            value['doShow'] = false;
            return arr;

          });
        }
        that.setData({
          list: list
        });
      },
      fail: function () {
        wx.showToast({
          title: '请求服务器失败',
          icon: 'none'
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.audioContext.pause();
    this.audioContext2.pause();
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