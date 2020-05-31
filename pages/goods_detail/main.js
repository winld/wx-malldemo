// pages/goods_detail/main.js
/**
 *  1点击轮播图预览大图功能
 *    给轮播图绑定点击事件
 *    调用小程序api previewImage
 *2 点击加入购物车
    1先绑定点击事件
   2获取缓存中的购物车数据 数组格式
   3先判断 当前的商品是否已经存在于购物车
   4 已经存在 媳妇爱商品数据 执行购物车数量++ 重新把购物车数组 填充回缓存中
   5不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素带上 购买数量属性num 重新把购车数组 填充回缓存中
   6弹出提示
  3 商品收藏
     1 页面onShow的时候 加载缓存中的商品收藏的数据
     2 判断当前商品是否被收藏
        1 是 改变页面的图标
        2 不是
     3 点击商品收藏按钮
        1 判断该商品是否存在于缓存数据中
        2 已经存在  把该商品删除
        3 没有存在 把该商品添加到收藏数组中 存入到缓存中即可   
 */
import { showToast } from "../../utils/asyncWx.js";
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    isCollect: false
  },
  //商品对象
  GoodsInfo: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取 navgatior 跳转 传过来的 goods_id
    this.getGoodDetail(options.goods_id);
  },
  onShow () {
    let pages = getCurrentPages();
    //2 数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    const { goods_id } = currentPage.options;
    this.getGoodDetail(goods_id);


  },
  async getGoodDetail (goods_id) {
    const detail = await request({
      url: '/v1/goods/detail',
      data: { goods_id }
    });
    this.GoodsInfo = detail;

    //获取缓存中的商品收藏数组
    const collects = wx.getStorageSync('collects') || [];
    //判断是否收藏
    // const index = collects.findIndex(v => goods_id == v.goods_id);
    // let isCollect=false;
    // if (index > -1) {
    //   isCollect = true;
    // }
    let isCollect = collects.some(v => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      detail: {
        goods_id: detail.goods_id,
        goods_name: detail.goods_name,
        goods_price: detail.goods_price,
        //inpone部分手机不识别webp图片格式
        //最好找后台 进行修改
        //临时自己改 确保后台存在1.webp=>1.jpg
        goods_introduce: detail.goods_introduce.replace('/\.webp/g', '.jpg'),
        pics: detail.pics
      },
      isCollect
    });
  },
  //点击轮播图，预览大图
  handelPreImage (e) {
    //构造要预览的的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    //接收传递过来的图片URL
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  //点击加入购物车
  handelCarAdd () {
    //获取缓存中的购物车数组
    let car = wx.getStorageSync('car') || [];
    //判断商品对象是否存在于购物车数组中
    let index = car.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {//不存在于购物车
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      const storyInfo = {
        goods_id: this.GoodsInfo.goods_id,
        goods_name: this.GoodsInfo.goods_name,
        goods_price: this.GoodsInfo.goods_price,
        goods_small_logo: this.GoodsInfo.goods_small_logo,
        num: this.GoodsInfo.num,
        checked: this.GoodsInfo.checked
      }
      car.push(storyInfo);
    } else {
      //已经存在于购物车中 数量+1
      car[index].num++;
    }
    //把购物车重新添加回缓存中
    wx.setStorageSync('car', car);
    //弹窗提示
    wx.showToast({
      title: '添加购物车成功',
      icon: "success",
      mask: true
    })
  },
  //点击收藏
  handelCollect () {
    const { isCollect, detail } = this.data;
    let collects = wx.getStorageSync('collects') || [];
    const index = collects.findIndex(v => detail.goods_id === v.goods_id);
    if (index !== -1) {
      collects.splice(index, 1);
      showToast({title:"取消成功",icon:"success",mask:true});
    } else {
      collects.push(detail);
      showToast({title:"收藏成功",icon:"success",mask:true});
    }
    //重置收藏
    wx.setStorageSync('collects', collects);
    this.setData({
      isCollect: !isCollect
    })
  },
  handelBuy(){
    
  }
})