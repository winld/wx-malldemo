/**
 * 1.用户上滑页面，滚动条触底，开始加载下一页数据
 *   1 找到滚动条触底事件 微信小程序官方文档
 *   2 判断还有没有下一页
 *   3 假如没有下一页数据，弹出提示信息
 *   4.假如还有下一页数据 来加载下一页数据
 */

import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      { id: 0, value: "综合", isActive: true },
      { id: 1, value: "销量", isActive: false },
      { id: 2, value: "价格", isActive: false }
    ],
    goodList: [],
    totalPage: 0
  },
  //请求商品列表参数封装
  queryParams: {
    cid: 0,
    query: '',
    pagenum: 1,
    pagesize: 10
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryParams.cid = options.cid || '';
    this.queryParams.query = options.query || '';
    this.getGoods();
  },

  async getGoods () {
    const res = await request({
      url: "/v1/goods/search",
      data: this.queryParams
    });
    const goodList = res.goods;
    const total = res.total;
    if (total % this.queryParams.pagesize === 0) {
      this.totalPage = total / this.queryParams.pagesize;
    } else {
      this.totalPage = parseInt(total / this.queryParams.pagesize) + 1;
    }
    this.setData({
      goodList: [...this.data.goodList, ...goodList]
    });
    //关闭刷新
    wx.stopPullDownRefresh();
  },
  //标题点击⌚️，子组件传递过来的
  handleTabsItemChange (e) {
    //获取被点击的标题索引
    let { index } = e.detail;
    // 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  },
  //滚动条触底事件 滚动到底部触发
  onReachBottom () {
    if (this.queryParams.pagenum >= this.totalPage) {//没有下一页了
      wx.showToast({
        title: '没有下一页数据了',
      })
    } else {
      this.queryParams.pagenum++;
      this.getGoods();
    }
  },
  //下拉页面重新刷新
  onPullDownRefresh () {
    //重制商品列表
    this.setData({
      goodList: []
    })
    //重置页码
    this.queryParams.pagenum = 1;
    //发送请求
    this.getGoods();

  }
})