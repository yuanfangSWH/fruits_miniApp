// pages/my/like.js

//获取应用实例
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //收藏数据
    goodsList: [],
    //数据页数
    pageIndex: 1,
    //上拉触底事件依据
    noMore: false,
  },
  //拉取收藏数据方法
  loadData: function () {
    app.api('/wechat/like/get', {
      index: this.data.pageIndex
    }, (status, res) => {
       //判断status为false或true
      if (status) {
        if (this.data.pageIndex == 1) {
          //停止当前页面下拉刷新。
          wx.stopPullDownRefresh();
          this.setData({
            'goodsList': res.data,
            'noMore': false
          })
        } else {
          this.setData({
            //不是第一页就直接将返回的数据和之前的合并
            'goodsList': this.data.goodsList.concat(res.data)
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
  //取消收藏方法
  goDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/goodsDetail?id=' + id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //调用拉取收藏数据方法
    this.loadData();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 页面设置为1
    this.data.pageIndex = 1;
    //调用拉取收藏数据方法
    this.loadData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 如果不是到底就继续加载
    if (!this.data.noMore) {
      //页数设置+1
      this.data.pageIndex += 1;
      //调用拉取收藏数据方法
      this.loadData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})