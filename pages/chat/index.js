const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    messages: [
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  onShow: function(){
    this.loadData();
    var that = this;
    setInterval(function(){
      that.loadData();
    },5000);
  },

  //加载数据
  loadData: function () {
    var that = this;
    wx.request({
      url: app.data.hostUrl + '/Chat/chatList',
      method: 'get',
      data: {
        id: app.globalData.userInfo['id']
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        res = res.data;
        if (res.errNo == 0) {
          that.setData({
            messages: res.data
          })
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:getComments',
          duration: 2000
        });
      },
    });
  }
})