//app.js
App({
  onLaunch: function () {
    // 登录

  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {

    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          var code = res.code;
          //get wx user simple info
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
            },
            fail: function (res) {
              wx.showModal({
                title: '警告',
                content: '未授权微信登录，请在个人中心底部进行登录',
                showCancel: false
              })
            }
          });
        }
      });
    }
  },
  
  globalData: {
    userInfo: null
  }
})