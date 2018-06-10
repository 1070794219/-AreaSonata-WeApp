// pages/scan/index.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showModal({
      title: '提示',
      content: '检测到特征码为:' . options['t_id'],
      showCancel: false
    })
    this.setData({
      code: options['t_id']
    });
    wx.showLoading({
      title: '查询中',
    });

    wx.request({
      url: app.data.hostUrl + '/Mark/searchCode',
      method: 'get',
      data: {
        code: options['t_id'],
        params: options
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        res = res.data;
        if(res.status == 0){
          //成功
          //判断当前码的状态
          if(res.type == 0){
            //未使用
            wx.navigateTo({
              url: '/pages/mark/mark?code=' + options.t_id,
            })
          }else{
            //已经使用
            wx.navigateTo({
              url: '/pages/articals-info/index?code=' + options.t_id,
            })
          }
          
        }else{
          wx.showModal({
            title: '错误提示',
            content: res.err,
            showCancel: false
          })
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:getComments',
          duration: 2000
        });
      },
      complete: function(){
        wx.hideLoading();
      }
    });
  }
})