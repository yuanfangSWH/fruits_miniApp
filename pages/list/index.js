// pages/list/index.js

var app = getApp();
Page({
  data: {
    //数据页数
    pageIndex: 1,
    //商品数据
    hotList: [],
    //上拉触底事件依据
    noMore: false,
    //搜索框值
    search: '',
    //筛选条件
    screening: '',
    //分类id  默认填1
    categoryId: 1,
    //筛选样式
    rollingSwiper: '',
    //没有更多了
    noNumber: ''
  },
  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {
    if (options.keyWord) {
      //调用搜索关键字方法
      this.search(options.keyWord);
      //保留关键字
      this.setData({
        'search': options.keyWord
      })
    }else{
      //调用拉取列表数据方法
      this.loadData();
    }
  },
  //搜索关键字方法
  search: function (keyWord) {
    app.api('/wechat/goods/search', {
      keyWord: keyWord
    }, (status, res) => {
      //判断status为false或true
      if (status) {
        this.setData({
          'hotList': res.data,
          'noMore': true
        })
      }
    })
  },
  //筛选条件方法
  changeFilter: function (e) {
    var type = e.currentTarget.dataset.type;
    this.data.rollingSwiper = type;
    //筛选样式判断
    if (this.data.rollingSwiper == type) {
      this.setData({
        rollingSwiper: type
      })
    } 
    //赋值筛选条件
    this.setData({
      screening: type
    });
    //调用拉取数据方法
    this.loadData(true);
  },
  //拉取列表数据方法
  loadData: function () {
    app.api('/wechat/goods/filter', {
      id: this.data.categoryId, //分类条件变量
      type: this.data.screening, //筛选条件
      index: this.data.pageIndex //页数
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
            'noMore': true,
            'noNumber': "没有更多了"
          });
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
    //调用拉取数据方法
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
      //调用拉取数据方法
      this.loadData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})