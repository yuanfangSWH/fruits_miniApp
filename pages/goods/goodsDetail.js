// pages/layout/goodsDetail.js

//获取应用实例
var app = getApp();
//调用自己写的第三方库
var trolley = require('../../utils/trolley');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //数据
    goodsDetail: {},
    //价格
    totalMoney: 0,
    //数量
    number: 1,
    //hidden隐藏显示依据值
    isHidePop: true,
    //详细.评论TAB
    showType: 'detail'
  },
  //详细.评论TAB
  changeType: function (e) {
    var type = e.target.dataset.type;
    this.setData({
      showType: type
    })
  },
  //被数量组件调用的方法
  onChange: function (e) {
    //接收到传过来的数量值
    var number = e.detail;
    //totalMoney = （价格*数量）.四舍五入为只有2位小数位数的数字
    var totalMoney = (this.data.goodsDetail.price * number).toFixed(2);
    this.setData({
      number: number,
      totalMoney: totalMoney
    })
  },
  //加入购物篮.弹出数量弹框
  addToCart: function () {
    if (this.data.isHidePop) {
      return this.setData({
        isHidePop: false
      })
    }
    //调用自己写的第三方库.把整理好的数据带过去.当前数量.商品分类
    trolley.set(this.data.goodsDetail, this.data.number, 'add');
    //显示模态对话框
    wx.showModal({
      title: '提示',
      content: '是否前去购物车结算',
      //接口调用成功的回调函数
      success: function(res) {
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/shopping/index'
          })
        }
      }
    })
  },
  //立即下单.弹出数量弹框
  takeOrder: function () {
    if (this.data.isHidePop) {
      return this.setData({
        isHidePop: false
      })
    }
    //调用自己写的第三方库.清除所有数据内没有选中的商品
    trolley.selectAll(false);
    //调用自己写的第三方库.把整理好的数据带过去.当前数量.商品分类
    trolley.set(this.data.goodsDetail, this.data.number, 'update');
    wx.navigateTo({
      url: '/pages/payment/payment'
    })
  },
  //跳转到购物车页
  goCart: function () {
    wx.switchTab({
      url: '/pages/shopping/index'
    })
  },
  //收藏/取消收藏
  like: function () {
    app.api('/wechat/like/like', {
      //商品id
      goodsId: this.data.goodsDetail.id,
      //收藏依据字段
      isLike: !this.data.goodsDetail.isLike
    }, (status, res) => {
      //判断status为false或true
      if (status) {
        this.setData({
          'goodsDetail.isLike': !this.data.goodsDetail.isLike
        })
      }
    }, 'POST')
  },
  //关闭数量弹框
  hidePop: function () {
    this.setData({
      isHidePop: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      app.api('/wechat/goods/get?id=' + options.id, null, (status, res) => {
        //判断status为false或true
        if (status) {
          this.setData({
            goodsDetail: res.data,
            totalMoney: res.data.price
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.goodsDetail.name,
      imageUrl: this.data.goodsDetail.image
    }
  }
})