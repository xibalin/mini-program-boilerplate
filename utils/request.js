import reConfig from '../constants/releaseConfig';
const request = (prefix = `${reConfig.requestUrl}/okkaozheng/app`) => {
  let methods = ['get', 'post', 'del', 'put'];
  let result = {};
  methods.forEach(item=>{
    result[item] = wrapMethod(item, prefix);
  });
  return result;
};

function wrapMethod(methodName, prefix){
  return (url, data = {}) => {

    let fetchUrl = `${prefix}${url}`;
    return new Promise((resolve, reject)=>{
      wxRequest(fetchUrl, data, methodName.toUpperCase(), resolve, reject)
    })

  };
}

function wxRequest(url, data, method, resolve, reject){
  let header = {};
  let unionid = wx.getStorageSync('unionid');  
  header['content-type'] = 'application/x-www-form-urlencoded';
  unionid && (header['cookie'] = `uid=${wx.getStorageSync('uid')}`);
  wx.request({
    url, 
    data,
    header,
    method,
    success: function(res) {
      if (res.statusCode == 200){
        if (res.data.code == 401){
          login(function(){
            wxRequest(url, data, method, resolve, reject);
          })
        } else {
          resolve(res.data); 
        }
      } else {
        reject();
      }
    },
    fail: reject,
  })
}

function getUserInfo(code, cb){
  wx.getUserInfo({
    withCredentials: true,
    success: function(res) {
      let userInfo = res.userInfo;
      let nickName = userInfo.nickName;
      let headUrl = userInfo.avatarUrl;
      let gender = userInfo.gender ;
      let { encryptedData, iv } = res;
      request().post('/mina/login', {
        code,
        nickName,
        headUrl,
        gender,
        encryptedData,
        iv,
      }).then(res=>{
        if (res.code == 200){
          wx.setStorageSync('unionid', res.data.unionid);
          wx.setStorageSync('uid', res.data.id);
          wx.setStorageSync('openid', res.data.openid);
          wx.setStorageSync('session_key', res.data.session_key);
          request().post('/wx/user').then(res=>{
            if (res.code == 200){
              
              wx.setStorageSync('userInfo', res.data);
              cb();
            }
          })
        }
      })
    }
  })
}

function login(cb){
  wx.login({
    success: loginRes => {
      
      wx.getSetting({
        success: setRes=>{
          if (setRes.authSetting['scope.userInfo'] === false){
            wx.showModal({
              title: '提示',
              content: '授权后才能正常使用功能',
              showCancel: false,
              success: res=>{
                if (res.confirm){
                  wx.openSetting({
                    success: sus=>{
                      getUserInfo(loginRes.code, cb)
                    }
                  })
                }
                
              }
            })
          } else {
            wx.authorize({
              scope: 'scope.userInfo',
              success: sus=>{
                getUserInfo(loginRes.code, cb)
              }
            })
          }
        }
      })
    },
    fail:()=>{
      wx.hideLoading();
      wx.showModal({
        title:'提示',
        content:'登录失败，请重新进入'
      })
    }
  })
}

module.exports = request;

