//address/editor.js
var app = getApp()

Page({
  data: {
    //地址数据
    addressData: {
      //标签
      remark: "",
      //收货人
      name: "",
      //地区数据
      province: "省",
      city: "市",
      area: "区",
      //详细地址
      stress: "",
      //手机号
      phone: "",
    },
    //地区
    region:['','','']
  },
  //地区选择器
  bindRegionChange: function (e) {
    this.data.region = e.detail.value;
    this.data.addressData['province'] = this.data.region[0];
    this.data.addressData['city'] = this.data.region[1];
    this.data.addressData['area'] = this.data.region[2];
    this.setData({
      addressData: this.data.addressData
    })
  },
  //保存地址方法
  save: function () {
    //trim() 方法去掉空白
    //验证收货人
    if (this.data.addressData.name.trim() == '') {
      return wx.showToast({
        title: '未填收货人',
        image: '/images/error.png'
      })
    }
    //验证手机号
    if (!/^1\d{10}$/g.test(this.data.addressData.phone)) {
      return wx.showToast({
        title: '手机号格式错误',
        image: '/images/error.png'
      })
    }
    //验证地区
    if ((this.data.addressData.province == '省' && this.data.addressData.city == '市' && this.data.addressData.area == '区')) {
      return wx.showToast({
        title: '未选择地区',
        image: '/images/error.png'
      })
    }
    //验证详细地址
    if (this.data.addressData.stress.trim() == '') {
      return wx.showToast({
        title: '未填详细地址',
        image: '/images/error.png'
      })
    }
    app.api('/wechat/address/save', this.data.addressData, (status, res) => {
      //判断status为false或true
      if (status) {
        wx.showToast({
          title: '保存成功!',
          icon: 'success'
        })
        setTimeout(() => {
          //返回到原页面
          wx.navigateBack();
        }, 1500);
      }
    }, 'POST')
  },
  //输入框值获取.赋值
  onInput: function (e) {
    var key = e.currentTarget.dataset.key;
    this.data.addressData[key] = e.detail.value;
    this.setData({
      addressData: this.data.addressData
    })
  },
  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {
    if (options.id) {
      //获取我的地址
      app.api('/wechat/address/get?id=' + options.id, null, (status, res) => {
        if (status) {
          this.setData({
            addressData: res.data
          })
        }
      })
    }
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
     * 用户点击右上角分享
     */
  onShareAppMessage: function () {

  }
})