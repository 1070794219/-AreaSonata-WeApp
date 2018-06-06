// pages/mark/mark.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    image:'', //上传图片
    temp_image: '', //图片相对路径
    name: '',
    desc: '',
    edit:false,
    gua: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      code: options.code
    });
    console.log(options.code);

    //编辑状态
    if (options.edit == 'true') {
      this.setData({
        edit: true
      })
      console.log("编辑状态");
      this.loadData();
    }
  },

  //选择照片
  chooseImg: function(){
    var that = this
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        var tempFilePaths = res.tempFilePaths
        
        wx.showLoading({
          title: '正在上传图片',
        });
        //上传图片
        that.uploadPhoto(tempFilePaths);
      }
    })  
  },

  //上传图片
  uploadPhoto: function (image) {
    var that = this
    wx.uploadFile({
      url: app.data.hostUrl + '/Mark/upload', //仅为示例  
      filePath: image[0],
      name: 'image',
      success: function (res) {
        wx.hideLoading();
        res = JSON.parse(res.data);;
        if (res.status == 0) {
          //上传成功
          that.setData({
            temp_image: res.image,
            image: app.data.uploadUrl + "/" + res.image,
          })
        } else {
          //上传失败
          wx.showToast({
            title: '上传失败',
            icon: 'loading'
          })
        }
      }
    })
  },

  inputName: function(e){
    this.data.name = e.detail.value;
  },

  inputDesc: function (e) {
    this.setData({
      desc: e.detail.value
    })
  },   

  //取消
  cancel: function(){
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },

  //提交
  submit: function(){
    console.log(this.data.name + " ==" + this.data.desc + " == " + this.data.image);
    if (this.data.name.length <= 0 || this.data.desc.length <= 0 || this.data.image.length <= 0){
      wx.showModal({
        title: '警告',
        content: '请完整填写信息，并选择一张图片',
        showCancel: false
      });
      return false;
    }


    //提交信息
    wx.showLoading({
      title: '正在提交,请稍等',
    })
    var that = this;
    var data = this.data;
    wx.request({
      url: app.data.hostUrl + '/Mark/add',
      method: 'post',
      data: {
        user_id: app.globalData.userInfo['id'],
        title: data.name,
        body: data.desc,
        image: data.temp_image,
        code: data.code,
        status: 0,
        type: (that.data.edit ? 'edit' : '')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading();
        // --init data        
        var data = res.data;
        if (data.status == 0) {
          //提交成功
          wx.showToast({
            title: '标记成功',
            icon: 'success'
          })

          setTimeout(function(){
            wx.redirectTo({
              url: '/pages/index/index',
            })
          },2000);
        }else{
          wx.showModal({
            title: '警告',
            content: data.err,
            showCancel: false
          })
        }
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
    if(this.data.edit){
      //编辑状态 返回个人中心
      wx.redirectTo({
        url: '/pages/user/index',
      })
    }else{
      wx.navigateBack({
        delta: 2
      })
    }
    
  },

  //编辑状态
  loadData: function(){
    var that = this;

    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.data.hostUrl + '/Mark/myMark',
      method: 'get',
      data: {
        id: app.globalData.userInfo['id'],
        code: that.data.code
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading();
        // --init data      
        
        var data = res.data;
        if (data.status == 0) {
          //获取成功
          data = data.res[0];
          that.setData({
            image: data.image, //上传图片
            temp_image: data.temp_image, //图片相对路径
            name: data.title,
            desc: data.body
          })

          if(data.status == '正常'){
            that.setData({
              gua: false
            })
          }else{
            that.setData({
              gua: true
            })
          }
        } else {
          wx.showModal({
            title: '警告',
            content: data.err,
            showCancel: false
          })
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:getsessionkeys',
          duration: 2000
        });
      },
    });
  },

  /**
   * 挂失
   */
  gua: function(e){
    var that = this;
    wx.request({
      url: app.data.hostUrl + '/Mark/gua',
      method: 'post',
      data: {
        id: app.globalData.userInfo['id'],
        code: that.data.code
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // --init data      

        var data = res.data;
        console.log(data);
        if (data.status == 0) {
          //获取成功
          that.setData({
            gua: !that.data.gua
          });
          wx.showToast({
            title: (that.data.gua ? "挂失" : "解除") + '成功',
          })
        } else {
          wx.showModal({
            title: '警告',
            content: data.err,
            showCancel: false
          })
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:getsessionkeys',
          duration: 2000
        });
      },
    });
  }
})