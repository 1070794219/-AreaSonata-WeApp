//app.js
App({
  data:{
    hostUrl: 'https://bfapi.xuzhengke.cn/index.php/Api',
  },

  onLaunch: function () {
    // 登录
    var that = this;
    wx.login({
      success:function(res){
        that.globalData.code = res.code;
      }
    });
    this.globalData.userInfo = wx.getStorageSync('userInfo') || null;
  },
  
  globalData: {
    code:null,
    userInfo: null
  }
})