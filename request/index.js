const BASE_URL="https://api-hmugo-web.itheima.net/api/public";
//同时发送异步请求的次数
let ajaxTime=0;


export const request=(params)=>{
   //判断url 中是否带有/my/ 请求的是私有路径 带上 header token
   let header ={...params.header};
   if(params.url.includes("/my/")){
      //拼接header 带上 token
      header["Authorization"]=wx.getStorageSync('token');
   }
   ajaxTime++;
   //显示加载中
   wx.showLoading({
     title: '加载中',
     mask:true
   })
   return new Promise((resolve,reject)=>{
      wx.request({
         ...params,
         header,
         url:BASE_URL+params.url,
         success: (result)=>{
            resolve(result.data.message);
         },
         fail: (err)=>{
            reject(err);
         },complete:()=>{
            ajaxTime--;
            if(ajaxTime===0){
               wx.hideLoading();
            }
         }
      });
   })

}