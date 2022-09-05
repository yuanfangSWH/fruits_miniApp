//app.js

App({
  onLaunch: function () {
    var updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
  },
  //接口调用都经过用户登录凭证id判断
  //url：地址 formData：参数条件 fn：回调函数 method：http方法/默认GET
  api: function (url, formData, fn, method) {
    if (!this.globalData.openid) {
      wx.showToast({
        title: '未登录',
        image: '/images/error.png'
      })
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        })
      }, 1000);
      return
    }
    //显示 loading 提示框
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    //发起网络请求
    wx.request({
      url: 'https://yuanfang.cn' + url,
      data: formData,
      method: method ? method : 'GET',
      header: {
        'openid': this.globalData.openid,
        'content-type': 'application/json'
      },
      dataType: 'json',
      //接口调用成功
      success: function (res) {
        //隐藏 loading 提示框
        wx.hideLoading();
        //判断凭证
        if (res.data.code != 200) {
          //fn等于function的话就执行&&后面的返回false，商品数据给回调函数
          typeof fn === 'function' && fn(false, res.data);
          //显示消息提示框
          wx.showToast({
            title: res.data.message || '服务器错误',
            image: '/images/error.png'
          })
        } else {
          //fn等于function的话就执行&&后面的返回true，商品数据给回调函数
          typeof fn === 'function' && fn(true, res.data);
        }
      },
      fail: function () {
        //隐藏 loading 提示框
        wx.hideLoading();
        //显示消息提示框
        wx.showToast({
          title: '服务器繁忙',
          image: '/images/error.png'
        })
      }
    })
  },
  // 更新用户数据到服务器
  saveUserInfo: function () {
    this.api('/wechat/user/save', this.globalData.userInfo, (status, data) => {
      //判断status为false或true
      if (status) {
        this.globalData.userInfo = data.data;
      }
      console.log(data);
    }, 'POST')
  },
  //清空用户信息数据
  globalData: {
    userInfo: null
  }
})