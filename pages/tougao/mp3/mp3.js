
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songs: []
  },
  /**
   * 生命周期函数--监听页面加载
   */

  
  onLongPress: function (e) {
    let audioInfo = e.target.dataset;
    let audioInfo2 = e.currentTarget.dataset;
    wx.showModal({
      title: ' 提示',
      content: '确定要选这首歌吗',
      success: function (res) {
        if (res.confirm) {
          Object.keys(audioInfo).length == 0 ? wx.setStorageSync("selectedAudio", audioInfo2) : wx.setStorageSync("selectedAudio", audioInfo);
        }
        
      }
    })
  },
  toPlay: function (e) {
    var info = e.target.dataset;
    var info2 = e.currentTarget.dataset;
    Object.keys(info).length == 0 ? wx.setStorageSync("songInfo", info2) : wx.setStorageSync("songInfo", info);
    wx.navigateTo({
      url: 'play'
    })
  },
  onLoad: function (options) {
    var searchInputVal = options.searchStr;
    var that = this;
    wx.request({
      url: 'http://songsearch.kugou.com/song_search_v2?keyword=' + searchInputVal + '&page=1&pagesize=30&userid=-1&clientver=&platform=WebFilter&tag=em&filter=2&iscorrection=1&privilege_filter=0',
      async: false,
      success: function (res) {
        
        res.data.data.lists.forEach(function (value, index) { //获取hash 30条
          if (value.FileHash != '' && value.AlbumID != '') {
            wx.request({
              url: 'http://www.kugou.com/yy/index.php?r=play/getdata&hash=' + value.FileHash + '&album_id=' + value.AlbumID,

              async: false,
              success: function (res) {
                var obj = res.data.data;
                Object.keys(obj).forEach((val, index) => { //循环根据hash找到playurl
                  if (val == 'img' || val == 'audio_name' || val == 'play_url' || val == 'author_name' || val == 'lyrics')
                    return false;
                  else
                    delete obj[val];
                });
                let arr = that.data.songs;
                obj.play_url != '' ? arr.push(obj) : undefined;
                that.setData({
                  songs: arr
                });      
              },
              fail: function () {
                console.log("获取playUrl失败");
              }
            });
          } else
            return false;
        });
        
      },
      fail: function () {
        wx.showToast({
          title: '获取音频失败',
          icon: 'none'
        });
      }
    });
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
    wx.removeStorageSync('selectedAudio');
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