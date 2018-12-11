var app = getApp();
var tempStore = {};
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
var substringTimeToDate = time => {
  return time.substring(0, 10);
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const getUserInfo = () => {
  var currentMember = wx.getStorageSync('currentWxMember');
  wx.request({
    url: httpUrlAndPort() + '/getMemberInfo',
    data: { id: currentMember[0].id },
    success: function (result) {
      wx.setStorageSync('currentWxMember', result.data.data[0]);
    }
  });
}
const getUserImage = () => {
  var currentMember = wx.getStorageSync('currentWxMember')[0];
  wx.request({
    url: httpUrlAndPort() + '/getMemberImg',
    data: { memberId: currentMember.id },
    success: function (result) {
      wx.setStorageSync('imageHeaderAddr', result.data);
    }
  });
  
}
const httpUrlAndPort = () => {
  return "http://182.90.10.41:8088";
}
const fitImgRule = (filePath) => {
  let temp = filePath.substring(filePath.lastIndexOf(".") + 1);
  let rule = "jpg|jpeg|png|ico|pic|bmp|gif|bmp";
  return rule.indexOf(temp) > -1 ? true : false;
}
module.exports = {
  formatTime: formatTime,
  substringTimeToDate: substringTimeToDate,
  getUserInfo: getUserInfo,
  getUserImage: getUserImage,
  httpUrlAndPort: httpUrlAndPort,
  fitImgRule: fitImgRule
}
