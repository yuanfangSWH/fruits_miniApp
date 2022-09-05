// component/number.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //数量值
    number: {
      type: Number,
      value: 1
    },
    //数量下限值
    min: {
      type: Number,
      value: 1
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //减少
    down: function() {
      //数量不能低于1
      if (this.data.number > this.data.min) {
        this.setData({
          number: this.data.number -= 1
        });
      } else {
        this.setData({
          number: this.data.min
        });
      }
      this.onChange();
    },
    //增加
    up: function() {
      if (this.data.number <= 0) {
        this.setData({
          number: 1
        });
      } else {
        this.setData({
          number: this.data.number += 1
        });
      }
      this.onChange();
    },
    //输入框失去焦点时触发
    onBlur: function(e) {
      //数量值=输入值
      this.data.number = parseInt(e.detail.value);
      this.onChange();
    },
    //键盘输入时触发
    onInput: function(e) {
      //数量值=输入值
      this.data.number = parseInt(e.detail.value);
    },
    //组件数量事件
    onChange: function() {
      //当前数量值是否小于0，是=1 否=当前数量值
      this.data.number = this.data.number < 0 ? 1 : this.data.number;
      //触发页面调用组件的change事件(bind:change="onChange")，并带上数量值
      this.triggerEvent('change', this.data.number);
    }
  }
})