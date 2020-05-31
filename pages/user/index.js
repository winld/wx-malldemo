// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {},
    collectNum:0
  },
  onShow(){
    const userinfo=wx.getStorageSync('userinfo');
    const collects=wx.getStorageSync('collects')||[];
    
    this.setData({
     userinfo,
     collectNum:collects.length
    });
   },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userinfo = wx.getStorageSync('userinfo');
    this.setData({
      userinfo
    })
  },

})