// pages/search/index.js
/*
    1、输入框绑定 值改变事件 input事件
        1、获取到输入框的值
        2、合法性判断
        3、检验通过 把输入框的值 发送到后台
        4、返回的数据打印到页面上
    2、防抖 (防止抖动) 定时器 节流
        1、 防抖 一般 输入框中 防止重复输入 重复发送请求
        2、节流 一般是用在页面下拉 和 上拉
        定义全局的定时器 id
*/
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime.js';
import {showToast} from "../../utils/asyncWx.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: "",
    searchs: [],
    timeId: -1,
    isFouse:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
     
  },

  handelInput (e) {
    let { value } = e.detail;
    // 2、检测 合法性
    if (!value.trim()) {
      // 当用户输入的是空格的时候
      showToast({ title: '请不要输入无效空格！' });
      this.handelCancel();
      value = '';
      return;
    }
    //显示取消按钮
    this.setData({
      isFouse:true
  });
    clearTimeout(this.timeId);
    // 防抖的 实现
    // 清除定时器
    this.timeId = setTimeout(() => {
      this.search(value);
    }, 1000);
  },
  async search (value) {
    const res = await request({ url: '/v1/goods/qsearch', data: { query: value } });
    this.setData({
      searchs: res
    })
  },
  handelCancel () {
    const inputValue = "";
    const searchs = [];
    this.setData({
      inputValue,
      searchs,
      isFouse:false
    })
  }
})