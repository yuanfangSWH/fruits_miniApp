//address/address.js

//获取应用实例
var app = getApp(),
  //新增.编辑返回后刷新页面的依据
  isHide = false;
Page({
  data: {
    //地址数据
    addressList: []
  },
  //拉取地址数据方法
  loadData: function() {
    app.api('/wechat/address/get', null, (status, res) => {
      //判断status为false或true
      if (status) {
        res.data = res.data.map(item => {
          //往数组里添加个item.select
          //select作为页面判断是否为默认地址
          item.select = item.status;
          return item
        })
        
        this.setData({
          addressList: res.data
        })
      }
    })
  },
  // 选择收货地址
  select: function(e) {
    var index = e.currentTarget.dataset.index;
    //储存数据到本地缓存'address'中，会覆盖掉原数据内容
    wx.setStorageSync('address', this.data.addressList[index]);
    //关闭当前页面，返回上一页面
    wx.navigateBack();
  },
  //新增收货地址
  newAddress: function() {
    wx.navigateTo({
      url: '/pages/address/editor'
    })
  },
  //编辑收货地址
  editAddress: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/address/editor?id=' + id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //调用拉取地址数据方法
    this.loadData();
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
    //判断刷新依据
    if (isHide) {
      //调用获取地址数据方法
      this.loadData();
      //刷新依据设置为false
      isHide = false;
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    //刷新依据设置为true
    isHide = true;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})