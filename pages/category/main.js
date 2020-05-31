// pages/category/main.js
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧的菜单数据
    leftMenuList: [],
    //右侧的商品数据
    rightContent: [],
    //被点击的左侧菜单
    currentIndex: 0,
    //
    srollTop: 0
  },
  //分类
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const cate = wx.getStorageSync('cates');
    console.log(!cate);
    if (!cate) {
      this.getCates();
    } else {
      //有旧数据 定义过期时间为10s
      if (Date.now() - cate.time > 1000 * 10) {
        //重新发送请求
        this.getCates();
      } else {
        this.Cates = cate.data;
        let rightContent = this.Cates[0].children;
        this.setData({
          rightContent
        })
      }
    }
  },
  async getCates () {
    // request({
    //   url: "/v1/categories"
    // }).then(res => {
    //   this.Cates = res.data.message;
    //   //把接口的数据存入到本地缓存中
    //    wx.setStorageSync("cates", { time:Date.now(), data: this.Cates });

    //   let leftMenuList = this.Cates.map(v => v.cat_name);
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })

    //使用es7 的async await来发送请求
    const res = await request({
      url: '/v1/categories',
    });
      this.Cates = res;
      //把接口的数据存入到本地缓存中
       wx.setStorageSync("cates", { time:Date.now(), data: this.Cates });

      let leftMenuList = this.Cates.map(v => v.cat_name);
      let rightContent = this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent
      })

  },
  handleItemTap (e) {
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      //将内容区滚动条 距离顶部的距离 重新设置为0;
      rightContent,
      scrollTop: 0
    });
  }

})