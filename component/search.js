// component/search.js
Component({
  // 这里定义了innerText属性，属性值可以在组件使用时指定
  properties: {
    search: {
      //类型
      type: String, 
      value: ""
    }
  },
  data: {
    inputVal:""
  },
  methods: {
    //监听搜索框输入变化
    inputTyping: function(e) {
      this.setData({
        inputVal: e.detail.value
      });
    },
    //搜索方法
    onSearch: function(e) {
      wx.navigateTo({
        url: '/pages/list/index?keyWord=' + this.data.inputVal
      })
    }
  }
})