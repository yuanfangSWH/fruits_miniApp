//pages/order/list.js

//获取应用实例
var app = getApp()
Page({
  data: {
    //停止自动滚动
    roll: false,
    //tab样式
    rollingSwiper: 0,
    //数据页数
    pageIndex: 1,
    //订单数据
    orders: [
      [],
      [],
      [],
      [],
      []
    ],
    //分类条件
    conditions: 0,
    //上拉触底事件依据
    noMore: false,
    //swiper高度
    height: 500
  },

  /**
   * 这里处理tab事件
   */
  swiperContent: function (e) {
    this.data.conditions = e.detail.current
    //调用拉取订单数据方法
    this.pullData();
    this.setData({
      rollingSwiper: e.detail.current
    })
  },
  // 切换当前页tab样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.rollingSwiper == cur) {
      return false;
    } else {
      this.setData({
        rollingSwiper: cur
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type) {
      this.setData({
        //分类条件
        conditions: options.type,
        //tab样式
        rollingSwiper: options.type
      });
    }
    //调用拉取订单数据方法
    this.pullData();
    //获取系统信息
    wx.getSystemInfo({
      success: res => {
        //windowHeight = 窗口高度-50
        this.data.windowHeight = res.windowHeight - 50;
        this.setData({
          //swiper高度
          height: this.data.windowHeight
        })
      }
    })
  },
  //拉取订单数据
  pullData: function () {
    app.api('/wechat/order/get', {
      //页数
      index: this.data.pageIndex,
      //分类条件
      type: this.data.conditions
    }, (status, res) => {
      //判断status为false或true
      if (status) {
        //var path = orders[$分类标识]
        var path = `orders[${this.data.conditions}]`;
        //判断页数为1
        if (this.data.pageIndex == 1) {
          //停止当前页面下拉刷新
          wx.stopPullDownRefresh();
          //订单数据
          this.setData({
            [path]: res.data,
            'noMore': false
          }, () => {
            this.justifyHeight(this.data.conditions);
          })
        } else {
          //将返回的数据和之前的合并
          this.setData({
            [path]: this.data.orders[this.data.conditions].concat(res.data)
          }, () => {
            this.justifyHeight(this.data.conditions);
          })
        }
        if (res.data.length < 10) {
          //小于10就无法上拉触底事件
          this.setData({
            'noMore': true,
          });
        }
      }
    })
  },
  //支付订单
  pay: function (e) {
    var index = e.currentTarget.dataset.index;
    var order = this.data.orders[this.data.conditions][index];
    console.log(order);
    app.api('/wechat/order/pay', {
      id: order.id
    }, (status, res) => {
      if (status) {
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: 'MD5',
          paySign: res.data.paySign,
          success: function () {
            var path = `orders[${this.data.conditions}][${index}].status`;
            this.setData({
              [path]: 2
            });
            wx.showToast({
              title: '支付成功!',
              icon: 'success'
            });
          },
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
  //取消订单方法
  cancelOrder: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log("值= " + index)
    //显示模态对话框
    wx.showModal({
      title: '提示',
      content: '是否取消该订单',
      success: res => {
        //判断用户点击了确认/取消
        if (res.confirm) {
          //取消订单
          app.api('/wechat/order/cancel', {
            id: this.data.orders[this.data.conditions][index].id
          }, (status) => {
            //判断status为false或true
            if (status) {
              //显示消息提示框
              wx.showToast({
                title: '取消成功!',
                icon: 'success'
              })
              //改变数据数组内容的分类组.避免调用拉取数据
              var path = `orders[${this.data.conditions}][${index}].status`;
              this.setData({
                [path]: 0
              });
            }
          })
        }
      }
    })
  },
  //删除订单方法
  deleteOrder: function (e) {
    var index = e.currentTarget.dataset.index;
    var id = this.data.orders[this.data.conditions][index].id;
    //显示模态对话框
    wx.showModal({
      title: '提示',
      content: '是否删除该订单',
      success: res => {
        //判断用户点击了确认/取消
        if (res.confirm) {
          app.api('/wechat/order/delete', {
            id: id
          }, (status) => {
            //判断status为false或true
            if (status) {
              //显示消息提示框
              wx.showToast({
                title: '删除成功!',
                icon: 'success'
              })
            }
            //删除数据数组下对应的内容.避免调用拉取数据
            this.data.orders[this.data.conditions].splice(index, 1);
            var path = `orders[${this.data.conditions}]`;
            //重新赋值改变页面状态
            this.setData({
              [path]: this.data.orders[this.data.conditions]
            });
          })
        }
      }
    })
  },
  goDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/order/detail?id=' + id
    })
  },
  justifyHeight: function (index) {
    console.log(index);
    wx.createSelectorQuery().selectAll('.getThisHeight').boundingClientRect(rects => {
      this.setData({
        'height': rects[index].height > this.data.windowHeight ? rects[index].height : this.data.windowHeight
      })
    }).exec()
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
    // 页面设置为1
    this.data.pageIndex = 1;
    //调用拉取订单数据方法
    this.pullData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 如果不是到底就继续加载
    if (!this.data.noMore) {
      //页数设置+1
      this.data.pageIndex += 1;
      //调用拉取订单数据方法
      this.pullData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})