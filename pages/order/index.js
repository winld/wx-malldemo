// pages/order/index.js
/**
 * onShow 不同于onLoad 没有options
 *  判断缓存中有无token
 *    1没有 直接跳转到授权页面
 *    2 有 直接查询订单返回
 * 1.页面被打开的时候 onShow 
 *  1 获取url上的参数type
 *   根据type 值决定tab中哪个元素被激活
 *  2 根据type去发送请求获取订单数据
 *  3 渲染页面
 *2 点击不同的标题，重新发送请求获取和渲染数据
 */
import { requestPayment, getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js";
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs: [
      { id: 0, value: "全部", isActive: true },
      { id: 1, value: "待付款", isActive: false },
      { id: 2, value: "待发货", isActive: false },
      { id: 3, value: "退款", isActive: false }
    ]
  },
  onShow () {
  //  const token =wx.getStorageSync('token');
  //  if(!token){
  //    wx.navigateTo({
  //      url: '/pages/auth/index',
  //    });
  //    return;
  //  }

    //1 获取当前的小程序的页面栈-数组 长度最大是10个页面
    let pages = getCurrentPages();
    //2 数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    // 3 获取url上的type参数
    const { type } = currentPage.options;
    // 4激活选中页面标题 type =1 index=0
    this.changeTitleByIndex(type-1);
   // this.getOrders(type);
  },

  async getOrders (type) {
    const res = await request({ url: "/v1/my/orders/all", data: { type } });
    this.setData({
     //时间撮处理
      order:res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    })
  },

 changeTitleByIndex(index){
// 修改源数组
let { tabs } = this.data;
tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
this.setData({
  tabs
})
 },

  handleTabsItemChange (e) {
    //获取被点击的标题索引
    let { index } = e.detail;
    this.changeTitleByIndex(index);
    //重新发送请求 type=1 order=0
    this.getOrders(index+1);
  }
})