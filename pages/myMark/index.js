// pages/myMark/index.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showData:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData();
  },

  /**
   * 加载数据
   */
  loadData: function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.data.hostUrl + '/Mark/myMark',
      method: 'get',
      data: {
        id: app.globalData.userInfo['id'],
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading();
        // --init data        
        var data = res.data;
        if (data.status == 0) {
          //获取成功
          that.setData({
            showData: data.res
          })
        } else {
          wx.showModal({
            title: '警告',
            content: data.err,
            showCancel: false
          })
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:getsessionkeys',
          duration: 2000
        });
      },
    });
  },

  /**
   * 编辑
   */
  edit: function(e){
    var code = e.currentTarget.dataset['code'];
    wx.redirectTo({
      url: '/pages/mark/mark?edit=true&code=' + code,
    })
  }
})