var app = getApp()
var timer = null;

Page({
  data: {
    message: [],
    inputMsg: "",
    scrollTop: 0,
    chat_id: 0
  },
  onLoad: function (options) {
    this.setData({
      chat_id: options.id
    })

    this.pageScrollToBottom();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.loadData();

    var that = this;
    timer = setInterval(function () {
      that.loadData();
    }, 5000);
  },

  onUnload:function(){
    //停止自动刷新请求
    clearInterval(timer);
    timer = null;
    wx.redirectTo({
      url: '/pages/chat/index',
    })
  },
  inputMsg: function (e) {
    this.setData({
      inputMsg: e.detail.value
    })
  },
  sendMessage: function (e) {
    var input = e.detail.value.input;
    if(input.length <= 0) return ;
    this.setData({
      inputMsg: input
    })

    var that = this;
    wx.request({
      url: app.data.hostUrl + '/Chat/sendMessage',
      method: 'post',
      data: {
        chat_id: that.data.chat_id,
        user_id: app.globalData.userInfo['id'],
        content: that.data.inputMsg
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        res = res.data;
        if (res.errNo == 0) {
          that.loadData();
          that.setData({
            inputMsg: ""
          })
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:getComments',
          duration: 2000
        });
      },
    });

  },
  setMessage: function (msg) {
    var msgList = this.data.message;
    msgList.push(msg);
    this.setData({
      message: msgList,
      inputMsg: "",
    })
  },

  // 加载数据
  loadData: function () {
    var that = this;
    wx.request({
      url: app.data.hostUrl + '/Chat/chatDetail',
      method: 'get',
      data: {
        chat_id: that.data.chat_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        res = res.data;
        var first = false;
        if (that.data.message.length == 0){
          first = true;
        }

        if(that.data.message.length < res.data.list.length){
          that.pageScrollToBottom();
        }
        if (res.errNo == 0) {
          that.setData({
            message: res.data.list,
            // scrollTop: res.data.length * 100
          })

          if (first) {
            that.pageScrollToBottom();
          }

          // console.log(res.data.from);
          wx.setNavigationBarTitle({
            title: res.data.from['nickname'],
          })
        }
       
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:getComments',
          duration: 2000
        });
      },
    });
  },

  //页面滚动到底部
  pageScrollToBottom: function () {
    var that = this;
    wx.createSelectorQuery().select('.scroll').boundingClientRect(function (rect) {
      // 使页面滚动到底部  
      console.log(rect.height);
      wx.pageScrollTo({
        scrollTop: rect.height + 100
      })
    }).exec() 
  },  
})