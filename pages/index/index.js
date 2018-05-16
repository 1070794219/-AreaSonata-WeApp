//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    nickname:'',
    headimg:''
  },
  onLoad:function(options){
    if (!app.globalData.userInfo) {
      app.getUserInfo();
    }else{
      console.log(app.globalData.userInfo);
      // this.setData({
      //   nickname:app.globalData.userInfo
      // });
    }
  }
})
