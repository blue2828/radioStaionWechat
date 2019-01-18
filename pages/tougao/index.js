
const app = getApp();
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {},
    dataLength: 0,
    items: [
      {id: 0, name: '0', value: '歌曲', checked: "true"},
      {id: 1, name: '1', value: '文章'}
    ],
    showType: 'song',
    searchInputVal: '',
    webviewUrl: '',
    descLength: 0,
    desc: '',
    imgSrc: '../images/file-add.png',
    uploadFieldText: '',
    selectedAudio: {},
    fileId: ''
  },
  toLive: function () {
    wx.navigateTo({
      url: '../history/demand/index'
    });
  },
  searchInputChange: function (e) {
    var that = this;
    that.setData({
      searchInputVal: e.detail.value
    });
  },
  descInput: function (e) {
    var that = this;
    that.setData({
      descLength: e.detail.value.length,
      desc: e.detail.value
    });
   
  },
  doSearch: function () {
    var that = this;
    wx.navigateTo({
      url: 'mp3/mp3?searchStr=' + that.data.searchInputVal
    })
  },
  inputChange: function (event) {
    var that = this;
    that.setData({
      dataLength: event.detail.value.length
    });
  },
  radioChange: function (e) {
    let val = e.detail.value;
    var that = this;
    if (val == '0') {
      that.setData({
        showType: "song"
      });
    }else {
      that.setData({
        showType: "article"
      });
    }
     that.setData({
       uploadFieldText: '',
       imgSrc: '../images/file-add.png',
       selectedAudio: {},
       fileId: '',
       dataLength: 0,
       descLength: 0
     }); 
    wx.removeStorageSync('selectedAudio');
  },
  showWebview: function () {
    var that = this;
    util.getUserInfo();
    var member = wx.getStorageSync('currentWxMember');
    var memberId = Array.isArray(member) ? member[0].id : member.id
    wx.navigateTo({
      url: 'webview?type=' + that.data.showType + '&memberId=' + memberId
    })
  },
  onReset: function () {
    var that = this;
    that.setData({
      desc: '',
      descLength: '',
      items: [
        { id: 0, name: '0', value: '歌曲', checked: "true" },
        { id: 1, name: '1', value: '文章' }
      ],
      uploadFieldText: '',
      selectedAudio: '',
      fileId: '',
      dataLength: 0,
      descLength: 0
    });
    wx.removeStorageSync('selectedAudio');
  },
  onSubmit: function (e) {
    var that = this;
    let info = e.detail.value;
    var reg = /^[0-9]+@{1}[0-9a-zA-Z]+.{1}\w+$/;
    if (info.toSb !='' && info.email == '') {
      wx.showModal({
        title: '警告',
        content: '请填入邮箱用以通知你要赠送的朋友'
      });
      return;
    }
    if (info.toSb != '' && info.wechatNo == '') {
      wx.showModal({
        title: '警告',
        content: '请填入对方微信号'
      });
      return;
    }
    if (info.email != '' && !reg.test(info.email)) {
      wx.showModal({
        title: '警告',
        content: '邮箱格式不正确'
      });
      return;
    }
    var datas = {};
    Object.keys(info).forEach((value, index) => {
      datas[value] = info[value];
    });
    var type = '';
    that.data.items.forEach((value, index) => {
      switch (value.checked) {
        case 'true' :
          type = value.name;
          break;
      }
    });
    datas.type = type;
    let kg_play_url = that.data.selectedAudio.play_url;
    datas.play_url = kg_play_url == undefined ? '' : kg_play_url;
    datas.fileId = that.data.fileId == undefined || that.data.fileId == null || that.data.fileId == '' ? 0 : that.data.fileId;
    console.log('-----' + wx.getStorageSync('cookie_id'));
    wx.request({
      url: util.httpUrlAndPort() + "/saveDemand",
      header: {
        'Cookie': wx.getStorageSync('cookie_id')
      },
      data: datas,
      dataType: 'json',
      success: function (res) {
        if (res.data.success) {
          wx.showToast({
            title: '投稿成功'
          })
        }else {
          wx.showToast({
            title: res.data.errMsg,
            icon: 'none'
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '请求服务器失败',
          icon: 'none'
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.count = 0;
    this.setData({
      selectedAudio: {}
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onMessage: function (res) {
    var that = this;
    let reg = /^\b(fileId:)\b[0-9]+&fileType/;
    if (reg.test(res)) {
      res = res.split("||")[0];
      var img = res.split("&")[1];
      var fileName = res.split("&")[2];
      fileName = fileName.substring(fileName.lastIndexOf("=") + 1);
      var imageSrc = img.indexOf(".pdf") > -1 ? '../images/file-pdf.png' :
        img.indexOf(".txt") > -1 ? '../images/file-text.png' :
          '../images/customerservice.png';
      that.setData({
        imgSrc: imageSrc,
        uploadFieldText: '已选文件: ' + fileName
      });
      that.setData({
        fileId: res.substring(res.indexOf(":") + 1, res.indexOf("&"))
      });
    }
    console.log(res);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    util.getMessage(this);
    if (that.count != 0) {
      var selectedSong = wx.getStorageSync('selectedAudio').info;
      that.setData({
        selectedAudio: selectedSong == undefined ? {} : selectedSong
      });
    }
    that.count ++;
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