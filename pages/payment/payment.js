// pages/payment/editor.js

//获取应用实例
var app = getApp();
//调用自己写的第三方库
var trolley = require('../../utils/trolley');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //商品数据
    goodsList: [],
    //地址
    address: {},
    //地址选择显示/隐藏
    hasAddress: false,
    //总价
    totalMoney: 0,
    //备注
    remark: '',
    //订单ID
    orderId: ''
  },
  //备注输入/完成时触发方法
  inputRemark: function (e) {
    this.data.remark = e.detail.value;
  },
  //提交订单验证
  takeOrder: function () {
    if (!this.data.address.id) {
      //显示消息提示框
      return wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
    }
    var postData = {
      //地址id
      address_id: this.data.address.id,
      //备注
      remark: this.data.remark,
      //商品列表数据
      detail: this.data.goodsList
    }
    app.api('/wechat/order/take', postData, (status, res) => {
      if (status) {
        //订单ID
        this.data.orderId = res.data;
        wx.showToast({
          title: '下单成功!',
          icon: 'success'
        });
        //列出goodsList数组的每个元素
        this.data.goodsList.forEach(item => {
          //购物车缓存数据更新
          trolley.set(item, 0, 'update');
        });
        //调用订单支付方法
        this.payOrder();
      }
    }, 'POST')
  },
  //订单支付方法
  payOrder: function () {
    app.api('/wechat/order/pay', {
      //订单ID
      id: this.data.orderId
    }, (status, res) => {
      if (status) {
        //发起微信支付
        wx.requestPayment({
          //当前的时间
          timeStamp: res.data.timeStamp,
          //随机字符串
          nonceStr: res.data.nonceStr,
          //统一下单接口返回的 prepay_id 参数值
          package: res.data.package,
          //签名算法
          signType: 'MD5',
          //签名
          paySign: res.data.paySign,
          //接口调用成功的回调函数
          success: function () {
            wx.showToast({
              title: '支付成功!',
              icon: 'success'
            });
            //关闭当前页面，跳转到url页面
            wx.redirectTo({
              url: '/pages/order/list'
            });
          },
          //接口调用失败的回调函数
          fail: function () {
            wx.showToast({
              title: '支付失败!',
              image: '/images/error.png'
            })
          }
        })
      }
    })
  },
  //选择地址
  choiceAddress: function () {
    wx.navigateTo({
      url: '/pages/payment/address'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //从本地缓存中同步获取'trolley'
    var trolleyData = wx.getStorageSync('trolley') || {};
    //声明一个空数组
    var temp = Array();
    for (const key in trolleyData) {
      //hasOwnProperty() 方法会返回一个布尔值，指示对象自身属性中是否具有指定的属性
      if (trolleyData.hasOwnProperty(key) && trolleyData[key].select) {
        //.push()向数组的末尾添加一个或多个元素，并返回新的长度
        temp.push(trolleyData[key]);
      }
    }
    var totalMoney = 0;
    //.forEach列出数组的每个元素
    temp.forEach(item => {
      //判断select值为选中的商品数据
      if (item.select) {
        //totalMoney += 价格 * 数量
        totalMoney += item.price * item.number;
        //item.totalMoney = （价格*数量）.四舍五入为只有2位小数位数的数字。
        item.totalMoney = (item.price * item.number).toFixed(2);
      }
    })
    //totalMoney = totalMoney.四舍五入为只有2位小数位数的数字。
    totalMoney = totalMoney.toFixed(2);
    this.setData({
      //商品数据
      goodsList: temp,
      //总价
      totalMoney: totalMoney
    })
    //获取默认收货地址
    app.api('/wechat/Address/getDefault', null, (status, res) => {
      if (status) {
        if (res.data) {
          this.setData({
            //地址数据
            address: res.data,
            hasAddress: true
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //从本地缓存中同步获取'address'
    var address = wx.getStorageSync('address')
    if (address) {
      this.setData({
        //地址数据
        address: address,
        hasAddress: true
      });
      //从本地缓存中同步移除'address'
      wx.removeStorageSync('address');
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  }
})