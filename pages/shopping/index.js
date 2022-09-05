// pages/shopping/index.js

//调用自己写的第三方库
var trolley = require('../../utils/trolley');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //购物车数据
    goodsList: [],
    // 总计金额
    totalMoney: 0,
  },
  //勾选商品方法
  checkboxChange: function (e) {
    console.log('check', e);
    //调用查询购物车数据方法.调用自己写的第三方库.把当前选中的checkbox的value带上
    this.trolleyToArray(trolley.select(e.detail.value));
  },
  //被数量组件调用的方法
  onChange: function (e) {
    //调整数量的商品数据
    var index = e.currentTarget.dataset.index,
    //接收到传过来的数量值
    number = e.detail;
    //调用查询购物车数据方法.调用自己写的第三方库.更新方法
    this.trolleyToArray(trolley.set(this.data.goodsList[index], number, 'update'));
    console.log(this.data.goodsList);
  },
  //删除商品
  deleteGoods: function (e) {
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '是否将该商品移除购物车',
      //接口调用成功的回调函数
      success: res => {
        //为 true 时，表示用户点击了确定按钮
        if (res.confirm) {
          //调用查询购物车数据方法.调用自己写的第三方库.更新方法
          this.trolleyToArray(trolley.set(this.data.goodsList[index], 0, 'update'));
        }
      }
    })
  },
  //付款下单
  takeOrder: function (e) {
    //.some()方法用于检测购物车数组中的元素是否满足指定条件 (item => item.select)
    //.some()方法会依次执行数组的每个元素.some()不会对空数组进行检测
    //bool = this.data.goodsList满足条件的数据
    var bool = this.data.goodsList.some(item => item.select);
    if (!bool) {
      return wx.showModal({
        title: '提示',
        content: '您还没选择商品',
        showCancel: false
      })
    } else {
      //保留当前页面，跳转
      wx.navigateTo({
        url: '/pages/payment/payment'
      })
    }
  },
  //查询购物车数据方法
  trolleyToArray: function (trolley) {
    //声明一个空数组
    var temp = Array();
    for (const key in trolley) {
      //判断key的名称是不是trolley对象的一个属性或对象，否则返回假
      if (trolley.hasOwnProperty(key)) {
        //用.push()方法向temp数组的末尾添加元素
        temp.push(trolley[key]);
      }
    }
    var totalMoney = 0;
    //列出temp数组的每个元素
    temp.forEach(item => {
      //判断是否是选中的商品数据
      if (item.select) {
        //totalMoney = （价格*数量）
        totalMoney += item.price * item.number;
      }
    })
    //totalMoney = totalMoney.四舍五入为只有2位小数位数的数字
    totalMoney = totalMoney.toFixed(2);
    this.setData({
      //购物车数据
      goodsList: temp,
      // 总计金额
      totalMoney: totalMoney
    })
  },
  //清空购物车方法
  clearAll: function () {
    //将数据存储在本地缓存中的'trolley'中，会覆盖掉原来该 'trolley' 对应的内容
    wx.setStorageSync('trolley', {});
    this.setData({
      //购物车数据
      goodsList: [],
      // 总计金额
      totalMoney: 0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //从本地缓存中同步获取'trolley'
    var trolleyData = wx.getStorageSync('trolley') || {};
    this.trolleyToArray(trolleyData);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //从本地缓存中同步获取'trolley'
    var trolleyData = wx.getStorageSync('trolley') || {};
    this.trolleyToArray(trolleyData);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})