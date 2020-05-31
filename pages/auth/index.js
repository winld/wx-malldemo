// pages/auth/index.js
import { login,showToast } from "../../utils/asyncWx.js";
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //获取用户授权信息
  async bindGetuserInfo (e) {
    try {
      //1.货物用户信息
      const { encryptedData, rawData, iv, signature } = e.detail;
      //2 获取小程序登录成功后的code
      const { code } = await login();
      const loginparams = { encryptedData, rawData, iv, signature, code };
      //发送请求 获取用户的token
      // const { token } = await request({ url: "/v1/users/wxlogin", data: loginparams, method: "post" });
      // //把token 存入缓存中 同时跳转回上一页
      // wx.setStorageSync('token', token);
      //返回上一页面
      setTimeout(() => {
        showToast({ title: '获取 token 失败，无法实现支付功能' });
      }, 10000);
      wx.navigateBack({
        delta: 1
      })
    } catch (error) {
      console.log(error);
    }
  }
})