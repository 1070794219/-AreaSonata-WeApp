const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    data: {
      'user_id': 0,
      'nickname': '',
      'header_img': '',
      'name': '',
      'desc': '',
      'image': ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.code = options.code;
    wx.showLoading({
      title: '数据加载中',
    });
    this.loadData(options.code);
  },

  //请求数据
  loadData: function(code){
    var that = this;
    wx.request({
      url: app.data.hostUrl + '/LostFound/foundByCode',
      method: 'get',
      data: {
        code: code
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        res = res.data;
        // --init data        
        that.setData({
          data: res.data
        });
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:getsessionkeys',
          duration: 2000
        });
      },
    });
  },

  //联系
  chat: function(){
    
    wx.showLoading({
      title: '正在联系失主',
    });

    var that = this;
    console.log(that.data.data['user_id'] + " == " + app.globalData.userInfo['id'] + " == " + that.data.data['name']);
    // return ;
    wx.request({
      url: app.data.hostUrl + '/LostFound/chat',
      method: 'post',
      data: {
        to_id: that.data.data['user_id'],
        from_id: app.globalData.userInfo['id'],
        name: that.data.data['name']
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading();
        res = res.data;
        var chat_id = res['chat_id'];

        wx.navigateTo({
          url: '/pages/chat/private-chat/index?id=' + chat_id,
        });
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:getsessionkeys',
          duration: 2000
        });
      },
    });
  },

    onUnload: function () {
      wx.navigateTo({url:'pages/index'})
    }
  
})