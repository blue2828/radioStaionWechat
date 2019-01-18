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
/*const formatLocaleDate = date => {
  date.toLocaleString)
};*/
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
    header: { "Cookie": wx.getStorageSync('cookie_id') },
    data: { id: Array.isArray(currentMember) ? currentMember[0].id : currentMember.id },
    success: function (result) {
      wx.setStorageSync('currentWxMember', result.data.data[0]);
    }
  });
}
const getUserImage = () => {
  var currentMember = wx.getStorageSync('currentWxMember')[0] == null ||
    wx.getStorageSync('currentWxMember')[0] == undefined ? wx.getStorageSync('currentWxMember') :
    wx.getStorageSync('currentWxMember')[0];
  wx.request({
    url: httpUrlAndPort() + '/getMemberImg',
    header: {"Cookie": wx.getStorageSync('cookie_id')},
    data: { memberId: currentMember.id },
    success: function (result) {
      wx.setStorageSync('imageHeaderAddr', result.data);
    }
  });
}
const httpUrlAndPort = () => {
  return "http://182.90.54.2:8088";
}

const wsUrlAndPort = () => {
  return 'ws://182.90.54.2:8088';
}
const initSocket = () => {
  const socketTask = wx.connectSocket({
    url: wsUrlAndPort() + '/pushUrl'
  });
  wx.onSocketOpen(function () {
    console.log("已连接到pushUrl endpoint");
  });
  wx.onSocketError(function () {
    console.log("连接websocket失败");
  });
  return socketTask;
}
function getMessage (context) {
  wx.onSocketMessage(function(res){
    try {
      console.log(res.data);
      context.onMessage(res.data);
    }catch(e) {
      console.log(e);
    }
  })
}

function sendMessage (text) {
  wx.sendSocketMessage({
    data: text
  })
}
function onMessage (res) {
  console.log(res);
  let urlAndPort = httpUrlAndPort();
  switch (res.indexOf("开播") > -1) {
    case true:
      wx.showModal({
        title: '提示',
        content: '学院广播电台已开播'
      });
      break;
  }
  /*that.setData({
    source: util.httpUrlAndPort() + "/pushRecordStreamByName?fileName=" + res.split("||")[0]
  });*/
  wx.setStorageSync('source', res.split("||")[0]);
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
  fitImgRule: fitImgRule,
  wsUrlAndPort: wsUrlAndPort,
  initSocket: initSocket,
  getMessage: getMessage,
  sendMessage: sendMessage
}
