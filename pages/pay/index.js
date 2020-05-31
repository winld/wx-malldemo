// pages/car/index.js
/**
 *  1、页面加载的时候
        1、从缓存中获取购物车数据 渲染到页面
            这些数据 checked=true
        2、微信支付
            1、哪些人 哪些账号  可以实现微信支付
                1、企业账号
                2、企业账号的小程序后台中 必须 给开发者 添加上白名单
                    1、 一个 appid 可以同时绑定多个开发者
                    2、这些开发者就可以公用这个 appid 和 它的开发权限
        3、支付按钮
            1、 先判断缓存中有没有token
            2、没有 跳转到授权页面 进行获取 token
            3、有 token 那就进行 正常操作
            4 创建订单 获取订单编号
            5 已经完成了微信支付
            6 手动删除缓存中 已经被选中的商品
            7 删除后的购物车数据 填充回缓存
            8 再跳转页面
 */
import { requestPayment, getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js";
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cars: [],
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
    let cars = wx.getStorageSync('car') || [];
    //过滤购物车数组
    cars = cars.filter(v => v.checked);
    //计算 底部工具栏的数据 总价格 购买数量
    let totalPrice = 0, totalNum = 0;
    cars.forEach(v => {
      totalPrice += v.goods_price * v.num;
      totalNum += v.num;
    });

    //把购物车数据重新设置回data中
    this.setData({
      address,
      cars,
      totalPrice,
      totalNum
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //点击收货地址
  async handelAddress () {
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

  //点击支付
  async handelOrderPay () {
    try {
      //1 获得缓存中的token 判断是否授权
      const token = wx.getStorageSync('token');
      //2 判断是否已获取到后台的token
      if (!token) {
        //跳转支付授权页面
        wx.navigateTo({
          url: '/pages/auth/index',
        });
        return;
      }
      console.log("已存在token");
      // 3 创建订单
      // 3.1装备请求头参数
      const header = { Authorization: token };
      // 3.2 准备请求体参数
      const order_price = this.data.totalPice;
      const consignee_addr = this.data.address.detail;
      const cars=this.data.cars;
      const goods = [];
      cars.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_pirce: v.goods_price
      })
      )
      const orderParams = { order_price, consignee_addr, goods };
      //4 准备发送请求 创建订单 获取订单编号
      const { order_number } = await request({ url: '/v1/my/orders/create', data: orderParams, method: "POST", header });

      // 5 发送 预支付接口 获得支付必要参数
      const { pay } = await request({
        url: 'url',
        method: "POST",
        data: { order_number },
        header
      });
      // 6.发起微信支付
      await requestPayment(pay);
      // 7.查询后动态订单（订单状态），查看是否支付成功
      const res = await request({
        url: "/v1/my/orders/chkOrder",
        method: "POST",
        header,
        data: { order_number }
      });
      await showToast({ title: "支付成功" });
      // 8.手动删除缓存中已经支付了的商品 过滤支付了的商品 重新更新购物车
      let newCars = wx.getStorageSync('car');
      newCars = newCars.filter(v => !v.checked);
      wx.setStorageSync('car', newCars);
      //9 支付成功了 跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index'
      });
    } catch (error) {
      await showToast({ title: "支付失败" });
    }
  },

})