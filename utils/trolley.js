//当前数据设为选中
const set = (goods, number, type) => {
  //从本地缓存中异步获取'trolley'的内容
  var trolley = wx.getStorageSync('trolley') || {};
  //判断goods.id的名称是不是trolley对象的一个属性或对象，否则返回假
  if (trolley.hasOwnProperty(goods.id)) {
    //判断根据type类型来对购物车删减更新
    switch (type) {
      case 'add': //添加
        trolley[goods.id].number += number;
        break;
      case 'reduce': //减少
        trolley[goods.id].number -= number;
        break;
      case 'update': //更新
        trolley[goods.id].number = number;
        break;
      default: //都不是
        break;
    }
    if (type != 'reduce') {
      trolley[goods.id].select = true; //设为选中
    }
    if (trolley[goods.id].number <= 0) {
      //如果数量小于等于0
      //从trolley对象删除id属性
      delete trolley[goods.id]
    }
  } else {
    //如果本地缓存里没有带过来的数据，就添加进本地缓存里
    if (type != 'reduce') {
      goods.number = number;
      goods.select = true;
      trolley[goods.id] = goods;
    }
  }
  //覆盖掉原本存储在本地缓存中的trolley数据
  wx.setStorageSync('trolley', trolley);
  //返回trolley
  return trolley
}
//勾选商品方法
const select = ids => {
  //从本地缓存中异步获取'trolley'的内容
  var trolley = wx.getStorageSync('trolley') || {};
  for (const key in trolley) {
    //判断key的名称是不是trolley对象的一个属性或对象，否则返回假
    if (trolley.hasOwnProperty(key)) {
      //.indexOf()判断如果没有找到匹配的字符串则返回 -1
      if (ids.indexOf(key) != -1) {
        trolley[key].select = true;
      } else {
        trolley[key].select = false;
      }
    }
  }
  //覆盖掉原本存储在本地缓存中的trolley数据
  wx.setStorageSync('trolley', trolley);
  //返回trolley
  return trolley
}

//购物车数据全部设为不选中
const selectAll = bool => {
  //bool（false）
  //从本地缓存中同步获取trolley
  var trolley = wx.getStorageSync('trolley') || {};
  //循环
  for (const key in trolley) {
    //判断key的名称是不是trolley对象的一个属性或对象，否则返回假
    if (trolley.hasOwnProperty(key)) {
      trolley[key].select = bool
    }
  }
  //覆盖掉原本存储在本地缓存中的trolley数据
  wx.setStorageSync('trolley', trolley);
  //返回trolley
  return trolley
}
//第三方库方法调用标识 es6 告诉外部这个模块带什么方法
module.exports = {
  set: set,
  select: select,
  selectAll: selectAll
}