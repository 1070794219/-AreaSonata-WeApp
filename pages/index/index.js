//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    nickname:'请登录',
    headimg:'',
    isLogin:false
  },
  onLoad: function (options) {
    this.login();
  },

  onShow: function(){
    // this.login();
  },

  login: function(){
    if (!app.globalData.userInfo) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/user/index',
            })
          }
        }
      })
    } else {
      this.setData({
        isLogin: true,
        nickname: app.globalData.userInfo['nickname'],
        headimg: app.globalData.userInfo['headimg']
      })
    }
  },

  //商城
  shopTap:function(){
    wx.showToast({
      title: '开发中',
      icon: 'loading'
    })
  },

  //扫码
  scan: function () {
    var that = this;
    var show;
    wx.scanCode({
      success: (res) => {
        console.log(res);
        //扫码成功
        var src = decodeURIComponent(res.path);
        var n = src.search(/=/);
        var code = src.substr(n + 1);
        wx.navigateTo({
          url: '/pages/scan/index?t_id=' + code,
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '扫码失败',
          icon: 'success',
          duration: 2000
        })
        wx.navigateBack({
          delta: 1
        });
      },
      complete: (res) => {
      }
    })
  },
})
