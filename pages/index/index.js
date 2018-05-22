//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    nickname:'',
    headimg:''
  },
  onLoad: function (options) {

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
    }
  },

  onShow: function(){
    
  },

  //商城
  shopTap:function(){
    wx.showToast({
      title: '开发中',
      icon: 'loading'
    })
  }
})
