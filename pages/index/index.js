//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    nickname:'请登录',
    headimg:'/images/icon/1.png',
    isLogin:false
  },
  onLoad: function (options) {
    this.login();
  },

  onShow: function(){
    this.login();
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
  }
})
