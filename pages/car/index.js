// pages/car/index.js
/**
 * 1获取用户的收货地址
 *   1，绑定点击事件
 *   2，调用小程序内置API 获取用户的收货地址 wx.chooseAddress
 * 2 获取用户对小程序所授权获取地址的权限状态 scope
 *   1 假设用户点击获取收货地址的提示框 确定
 *      scope 值 true  直接调用 获取收货地址
 *   2 假设用户 从来没用调用过收货地址的API
 *      scope 值 undefined  直接调用 获取收货地址
 *   3 假设用户点击获取收货地址的提示框 取消
 *      scope 值 false
 *        1 诱导用户 自己打开授权设置页面 当用户重新给予 收货地址权限的时候
 *        2 获取收货地址
 *    4把获取的收货地址存入缓存中
 * 3 页面加载完毕
 *   onLoad onShow
 *    1 获取本地缓存中的地址数据
 *    2 把数据设置给data中的一个变量
 * 4 onShow
 *    1 获取缓存中的购物车数组
 *    2 把购物车数据填充到data中
 * 5 全选的实现 数据的展示
 *    1 onshow 获取缓存中的购物车数据
 *    2 根据购物车中的商品数据 所有的商品都被选中 checked=true 全选就被选中
 * 6 总价格和总数量
 *    1 都需要商品被选中 我们才计算
 *    2 获取购物车数组
 *    3 遍历
 *    4 判断商品是否被选中
 *    5 总价格 +=商品单价* 商品数量
 *    6 把计算后的价格和数量 设置回data中
 * 
 * 7 商品的选中
 *   1 绑定change事件
 *   2 获取到被修改的商品对象
 *   3 商品对象的选中状态取反
 *   4 重新填充回data 中的缓存中
 *   5 重新计算全选 总价格 总数量
 * 8 全选和反选
        1、给全选复选框绑定事件
        2、获取data中的全选变量
        3、直接取反
        4、遍历购物车中数组 让里面商品 选中状态跟随  allChecked 改变而改变
        5、把购物车数组 和 allChecked 重新设置回data中 把购物车数组重新设置回缓存中
 *9 商品数量的编辑
        1、"+" "-" 按钮 绑定同一个点击事件 区分的关键 是自定义属性
            1、 "+" 加 +1
            2、"-"   减-
        2、传递被点击的商品id  goods_id
        3、获取data中的购物车数组 来获取须要被修改的商品对象
        4、当 购物车的数量  =1 同时 用户 点击 "-"
            弹框提示 询问用户 是否要删除
            1、确定 直接删除
            2、取消 什么都不做
        4、直接修改商品对象的数量 num
        5、把cart数组重新 设置回 缓存中和 data中
   10、点击结算
        1、判断有没有收货地址信息
        2、判断用户有没有选购商品
        3、经过以上验证，跳到支付页面
  */
import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js";
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cars: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  //获取缓存中的收货地址信息
  onShow () {
    const address = wx.getStorageSync('address');
    if (Object.keys(address).length != 0) {
      address.detail = address ? address.provinceName + address.cityName +
        address.countyName + address.detailInfo : '';
    }
    //获得缓存中购物车中的数据
    const cars = wx.getStorageSync('car') || [];
    //计算全选
    //every 数组方法 会遍历 会接收一个回调函数，那么 每一个回调函数都返回true 那么 every 方法的返回值为true
    //  只要有一个回调函数返回了false 那么不再循环执行 直接返回false
    // 空数组调用every，返回值就是true
    // const allChecked = cars.length ? cars.every(v => v.checked) : false;

    this.setData({
      address
    });
    this.setCar(cars);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //点击收货地址
  async handelAddress () {

    // 获取权限状态
    // wx.getSetting({
    //   success: (res) => {
    //     console.log(res);
    //     // 获取权限状态 主要发现一些属性名很怪异的时候 都要用[] 形式来获取属性值
    //     const scopeAddress = res.authSetting["scope.address"];
    //     if (scopeAddress === true || scopeAddress == undefined) {
    //       wx.chooseAddress({
    //         success: (res1) => {
    //           console.log(res1);
    //         },
    //       })
    //     } else {
    //       // 用户以前拒绝授权 先诱导用户打开授权页面
    //       wx.openSetting({
    //         success: (res2) => {
    //           // 可以调用收货地址代码
    //           wx.chooseAddress({
    //             success: (res3) => {
    //               console.log(res3);
    //             },
    //           })
    //         },
    //       })
    //     }
    //   }

    // });
    try {
      //获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      //2 判断 权限状态
      if (scopeAddress === false) {
        //用户以前拒绝授权 先诱导用户打开授权页面
        await openSetting();
      }
      //3 调用获取收货地址的API
      const address = await chooseAddress();
      wx.setStorageSync('address', address);
    } catch (error) {
      console.log(error);
    }

  },

  //商品的勾选功能
  handelItemchange (e) {
    // 1 获取被修改的商品的ID
    const goods_id = e.currentTarget.dataset.id;
    //获得购物车中数据
    const { cars } = this.data;
    //找到被修改的商品对象
    const index = cars.findIndex(v => v.goods_id === goods_id);
    //  选中状态取反
    cars[index].checked = !cars[index].checked;
    //重置购物车
    this.setCar(cars);
  },

  //点击“+”、“-”按钮
  async handelChangeNum (e) {
    const { operation, id } = e.currentTarget.dataset;
    const { cars } = this.data;
    const index = cars.findIndex(v => id === v.goods_id);
    if (operation === -1 && cars[index].num === 1) {//减
      // 弹框提示
      const res = await showModal({ content: '您是否要删除该商品！' });
      if (res.confirm) {//删除
        cars.splice(index, 1);
      }
    } else {
      // 进行商品数量修改
      cars[index].num += operation;
    }
    this.setCar(cars);
  },

  //点击结算
  async handelPay () {
    const { address, cars } = this.data;
    if (cars.length === 0) {//判断购物车是否为空
      await showToast({ title: '您还没有选购商品' });
      return;
    }
    if (Object.keys(address).length == 0) {//判断是否选择收货地址
      await showToast({ title: '请添加收货地址' });
      return;
    }
    //跳转支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    });
  },

  //全选功能
  handelCheckAll (e) {
    let { cars, allChecked } = this.data;
    allChecked = !allChecked;
    cars.forEach(v => v.checked = allChecked);
    this.setCar(cars);
  },

  //设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买数量
  setCar (cars) {
    let allChecked = true;
    let totalPrice = 0, totalNum = 0;
    cars.forEach(v => {
      if (v.checked) {
        totalPrice += v.goods_price * v.num;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    //判断数组是否为空
    allChecked = cars.length != 0 ? allChecked : false;
    //把购物车数据重新设置回data中和缓存中
    this.setData({
      cars,
      totalPrice,
      totalNum,
      allChecked
    });
    wx.setStorageSync('car', cars);
  },
})