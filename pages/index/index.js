//index/index.js

//获取应用实例
var app = getApp()
Page({
  data: {
    //幻灯片
    slideData: {
      activity: [],
      onsale: [],
      recommend: []
    },
    //幻灯片样式用
    rollingSwiper: 0,
    //数据页数
    pageIndex: 1,
    //商品数据
    hotList: [],
    //上拉触底事件依据
    noMore: false
  },
 //幻灯片样式方法
  swiperChange: function(e) {
    this.setData({
      rollingSwiper: e.detail.current
    })
  },
 /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 登录.调用接口获取登录凭证（code）
    wx.login({
      //接口调用成功的回调函数
      success: (res) => {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://fruit.cmtspace.cn/wechat/index/getOpenId',
            data: {
              code: res.code
            },
            //接口调用成功的回调函数
            success: res => {
              //判断接口返回的值
              if (res.data.code != 200) {
                wx.showToast({
                  title: '登录失败',
                  image: '/images/error.png'
                })
              } else {
                //赋值到app全局
                app.globalData.openid = res.data.data.openid;
                //调用拉取数据方法
                this.loadData();
                this.getSlideData();
              }
            },
            //接口调用失败的回调函数
            fail: () => {
              wx.showToast({
                title: '服务器错误',
                image: '/images/error.png'
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },
  //拉取数据方法
  loadData: function () {
    app.api('/wechat/goods/index', {
      //页数
      index: this.data.pageIndex
    }, (status, res) => {
      //判断status为false或true
      if (status) {
        //判断页数为1
        if (this.data.pageIndex == 1) {
          //停止当前页面下拉刷新
          wx.stopPullDownRefresh();
          //商品数据
          this.setData({
            'hotList': res.data,
            'noMore': false
          })
        } else {
          //不是第一页就直接将返回的数据和之前的合并
          this.setData({
            'hotList': this.data.hotList.concat(res.data)
          })
        }
        if (res.data.length < 10) {
          //小于10就无法上拉触底事件
          this.setData({
            'noMore': true
          });
        }
      }
    })
  },
  getSlideData: function () {
    app.api('/wechat/index/get', null, (status, res) => {
      if (status) {
        this.setData({
          slideData: res.data
        })
      }
    });
  },
  //商品跳转
  goDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/goodsDetail?id=' + id
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    // 页面设置为1
    this.data.pageIndex = 1;
    //调用拉取数据方法
    this.loadData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // 如果不是到底就继续加载
    if (!this.data.noMore) {
      //页数设置+1
      this.data.pageIndex += 1;
      //调用拉取数据方法
      this.loadData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})