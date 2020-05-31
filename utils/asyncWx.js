/**
 * promise 形式getSetting
 */
export const getSetting=()=>{
   return new Promise((resolve,reject)=>{
      wx.getSetting({
        success: (res) => {
           resolve(res);
        },
        fail:(err)=>{
           reject(err);
        }
      })
   })
}
export const chooseAddress=()=>{
   return new Promise((resolve,reject)=>{
      wx.chooseAddress({
        success: (res) => {
           resolve(res);
        },
        fail:(err)=>{
           reject(err);
        }
      })
   })
}
// 弹窗提示 用户是否删除商品 Promise形式的 showModal
export function showModal({content}) {
   return new Promise((resolve,reject)=>{
       wx.showModal({
           title:'提示',
           content:content,
           success:(res)=>{
               resolve(res);
           },
           fail:(err)=>{
               reject(err);
           }
       });
   });
}
//弹窗提示信息
export function showToast({title,icon="none"}) {
    return new Promise((resolve,reject)=>{
        wx.showToast({
            title:title,
            icon:icon,
            mask:true,
            duration: 1500,
            success:(res)=>{
                resolve(res);
            },
            fail:(err)=>{
                reject(err);
            }
        });
    });
}
/**
 * promise 形式 login
 */
export function login() {
    return new Promise((resolve,reject)=>{
        wx.login({
            timeout:10000,
            success:(res)=>{
                resolve(res);
            },
            fail:(err)=>{
                reject(err);
            }
        });
    });
}
/**
 * payment 微信小程序支付
 * @param {Object} pay  支付必须参数
 */
export const requestPayment=(pay)=>{
    return new Promise((resolve,reject)=>{
        wx.requestPayment({
            ...pay,
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            },
          })
    })
}