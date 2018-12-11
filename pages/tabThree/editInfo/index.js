// pages/tabThree/editInfo/index.js
var app = getApp();
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberInfo: {},
    imageHeaderAddr: '',
    date: '',
    gender: '',
    array: ['男', '女'],
    genderIndex: 0,
    filePath: ''
  },
  onSubmit: function (e) {
    var _self = this;
    var info = e.detail.value;
    if (info.email == '') {
      wx.showModal({
        title: '警告',
        content: '请填写邮箱地址'
      })
      return;
    }
    var reg = /^[0-9]+@{1}[0-9a-zA-Z]+.{1}com/;
    var phoneValidate = /^[0-9]{11}/;
    if (!reg.test(info.email)) {
      wx.showModal({
        title: '警告',
        content: '邮箱格式不正确'
      });
      return;
    }
    if (info.phone != '') {
      if (!phoneValidate.test(info.phone)) {
        wx.showModal({
          title: '警告',
          content: '手机号格式不正确'
        });
        return;
      }
    }
    if (_self.data.filePath == '' || _self.data.filePath == undefined) {
      wx.request({
        url: util.httpUrlAndPort() + '/editWxMember',
        data: {
          'id': app.globalData.memberInfo.currentWxMember.id,
          nickName: info.nickName,
          userName: info.userName,
          sex: info.sex,
          birthDay: info.birthDay,
          label: info.label,
          phone: info.phone,
          email: info.email
        },
        success: function (res) {
          if (res.data.isSuccessed) {
              wx.switchTab({
                url: '../index'
              });
          } else {
            wx.showToast({
              title: '信息保存失败，请稍后重试',
              icon: 'none'
            });
          }
        },
        fail: function(result) {
          wx.showModal({
            title: '提示',
            content: '请求失败'
          })
        }
      })
      return;
    }
    if (!util.fitImgRule(_self.data.filePath)) {
      wx.showModal({
        title: '警告',
        content: '不支持的图片格式，请上传jpg,jpeg,png,ico,pic,bmp,gif,bmp类型的图片'
      });
      return;
    }
    wx.uploadFile({
      url: util.httpUrlAndPort() + '/editWxMember', //仅为示例，非真实的接口地址
      filePath: _self.data.filePath,
      name: 'wxImg',
      formData: {
        'id': app.globalData.memberInfo.currentWxMember.id,
        nickName: info.nickName,
        userName: info.userName,
        sex: info.sex,
        birthDay: info.birthDay,
        label: info.label,
        phone: info.phone,
        email: info.email
      },
      success(res) {
        if (res.data) {
          wx.switchTab({
            url: '../index'
          });
        }else {
          wx.showToast({
            title: '信息保存失败，请稍后重试',
            icon: 'none'
          });
        }

      }
    })
  },
  changeImg: function () {
    var _self = this;
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        _self.setData({
          filePath: tempFilePaths[0],
          imageHeaderAddr: tempFilePaths[0]
        });
      }
    })
  },
  genderChange: function (e) {
    var _self = this;
    _self.setData({
      gender: e.detail.value == 0 ? '男' : '女'
    });
  },
  dateChange: function (e) {
    var _self = this;
    _self.setData({
      date: e.detail.value
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _self = this;
    util.getUserInfo();
    var currentMember = wx.getStorageSync('currentWxMember')[0];
    wx.request({
      url: util.httpUrlAndPort() + '/getMemberImg',
      data: { memberId: currentMember.id },
      success: function (result) {
        _self.setData({
          'imageHeaderAddr': 'data:image/png;base64,' + result.data
        });
        wx.setStorageSync('imageHeaderAddr', result.data);
      }
    });
    _self.setData({
      memberInfo: currentMember,
      date: currentMember.birthday == '' || currentMember.birthday == null ? '未设置生日' : util.substringTimeToDate(currentMember.birthday),
      gender: currentMember.sex,
      genderIndex: currentMember.sex == '男' ? 0 : currentMember.sex == '女' ? 1 :
        currentMember.sex
    });
    util.getUserImage();
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