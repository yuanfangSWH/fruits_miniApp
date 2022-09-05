//address/address.js
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
  //设为默认方法
  radioChange: function(e) {
    console.log(e);
    var index = e.detail.value;
    //找到数组内数据和当前点击的数据位置一致的然后item.select = true;
    var temp = this.data.addressList.map((item, idx) => {
      if (idx == index) {
        item.select = true;
      } else {
        item.select = false;
      }
      return item
    })
    var id = this.data.addressList[index].id;
    app.api('/wechat/address/setDefault?id=' + id, null, null);
    this.setData({
      addressList: temp
    })
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
  //删除地址
  deleteAddress: function(e) {
    var index = e.currentTarget.dataset.index;
    var id = this.data.addressList[index].id;
    //显示模态对话框
    wx.showModal({
      title: '提示',
      content: '确认删除该地址?',
      //接口调用成功的回调函数
      success: res => {
        //判断用户点击了确定/取消
        if (res.confirm) {
          // 用户点击了确定 可以调用删除方法了
          app.api('/wechat/address/delete?id=' + id, null, (status, res) => {
            //判断status为false或true
            if (status) {
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              })
              ////删除数据数组下对应的内容.避免调用拉取数据
              this.data.addressList.splice(index, 1);
              //重新赋值改变页面状态
              this.setData({
                addressList: this.data.addressList
              })
            }
          })
        }
      }
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