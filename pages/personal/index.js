// pages/personal/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //登录.是/否
    hasInfo: false,
    //用户信息数据
    userInfo: {},
  },
  //获取用户信息
  getuserinfo: function (e) {
    if (e.detail) {
      //传登录信息到接口待验证
      app.globalData.userInfo = e.detail.userInfo;
      //更新保存用户数据到服务器
      app.saveUserInfo();
      this.setData({
        //登录.是
        hasInfo: true,
        //用户数据
        userInfo: e.detail.userInfo
      })
    }
  },
  //查看全部订单
  onOrder: function (e) {
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/order/list?type=' + type
    })
  },
  //收藏夹
  onLike: function () {
    wx.navigateTo({
      url: '/pages/personal/like'
    })
  },
  //我的收货地址
  onAddress: function (e) {
    wx.navigateTo({
      url: '/pages/address/address'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 从服务器拉取用户信息,不用再点击登录按钮
    app.api('/wechat/user/get', null, (status, res) => {
      if (status) {
        if (res.data.avatar_url) {
          //登录.是
          this.data.hasInfo = true;
          //用户数据
          this.data.userInfo = res.data;
          //头像图片地址
          this.data.userInfo.avatarUrl = res.data.avatar_url;
          //用户名.昵称
          this.data.userInfo.nickName = res.data.nick_name;
          //调用setData改变页面状态
          this.setData(this.data);
        }
      }
    }, 'GET')
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