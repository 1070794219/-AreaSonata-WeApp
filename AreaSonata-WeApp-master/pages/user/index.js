// pages/user/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    headimg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.userInfo){
      this.setData({
        headimg: app.globalData.userInfo.headimg,
        isLogin:true
      });

      console.log(app.globalData.userInfo);
    }
  },

  onShow: function(){
    
  },

  //登录成功功能
  loginFunc: function(results){
    var code = app.globalData.code;
    console.log(code);
    wx.showLoading({
      title: '正在登录',
    });

    var that = this;

    wx.request({
      url: app.data.hostUrl + '/Login/getsessionkey',
      method: 'post',
      data: {
        code: code
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // --init data        
        var data = res.data;
        if (data.status == 0) {
          wx.showToast({
            title: data.err,
            duration: 2000
          });
          return false;
        }
        var userInfo = { 'openid': data.openid};
        app.globalData.userInfo = userInfo;
        that.onLoginUser(results);
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:getsessionkeys',
          duration: 2000
        });
      },
    });
  },

  // 获取用户信息
  onLoginUser: function (res) {
    var that = this;
    res = res.detail;
    wx.request({
      url: app.data.hostUrl + '/Login/authLogin',
      method: 'post',
      data: {
        nickname: res.userInfo.nickName,
        headimg: res.userInfo.avatarUrl,
        openid: app.globalData.userInfo['openid']
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data.res;
        var status = res.data.status;
        if (status != 1) {
          wx.showToast({
            title: res.data.err,
            duration: 3000
          });
          return false;
        }
        console.log(res);
        console.log(data);
        app.globalData.userInfo['id'] = data.id;
        app.globalData.userInfo['nickname'] = data.nickname;
        app.globalData.userInfo['headimg'] = data.headimg;
        that.setData({
          headimg: app.globalData.userInfo.headimg,
          isLogin: true
        });
        wx.hideLoading();
        //登录成功
        //存储数据
        wx.setStorage({
          key: 'userInfo',
          data: app.globalData.userInfo,
        });
      },
      fail: function (e) {
        console.log(e);
        wx.showToast({
          title: '网络异常！err:authlogin',
          duration: 2000
        });
        wx.hideLoading();
      },
    });
  }
})