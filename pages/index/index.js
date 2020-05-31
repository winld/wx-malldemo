//引入用来发送请求的方法 一定要把路径补全
import { request } from "../../request/index.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //轮播图数组
    swiperList: [],
    category: [],
    floorList: []
  },

  /**
   * 页面开始加载 就会触发
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //1.发送异步请求获取轮播数据 优化的手段可以通过es6的promise 来解决
    //  wx.request({
    //    url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //    success: (result)=>{
    //      this.setData({
    //       swiperList:result
    //      });
    //    },
    //    fail: ()=>{},
    //    complete: ()=>{}
    //  });
    this.getSwiperList();
    this.getCategory();
    this.getFloorList();
  },
  //获取轮播图数据
  getSwiperList () {
    request({
      url: "/v1/home/swiperdata"
    }).then(result => {
      this.setData({
        swiperList: result
      })
    })
  },
  //首页分类导航数据请求
  getCategory () {
    request({
      url: '/v1/home/catitems',
    }).then(result => {
      this.setData({
        category: result
      })
    });
  },
  //首页楼层数据请求
  getFloorList () {
    request({
      url: '/v1/home/floordata',
    }).then(result => {

      result.forEach(v => {
        v.product_list.forEach(item => {
          item.navigator_url = item.navigator_url.replace('/goods_list', '/goods_list/index');
        });
      })

      this.setData({
        floorList: result
      })
    });
  }
})