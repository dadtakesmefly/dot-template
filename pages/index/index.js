//index.js
import dot from '../../dotLib/dot'
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
var deviceInfo = wx.getSystemInfoSync()
var now = new Date().getTime();
var addition = {
  "timestamp": now,
  "version": deviceInfo.version,
  "platform": deviceInfo.platform,
  "id": 0,
};
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  /**
  * 页面信息的打点配置
  */
  __dot_page: function () {
    return {
      title: '打点demo首页',
      category: '用户信息打点',
      addition: '',
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
    dot.clickElement({
      clickElement: '按钮-点击头像跳转',
      url: '/pages/logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: '7RBBZ-V4LWG-NQRQD-IIIEH-35RGQ-4BBPZ'
    });
  },

  //button open-type=getUserInfo 唤起授权 失败后点击可再次唤起
  getUserInfo: function(e) {
       var that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          console.log(res)
          wx.getUserInfo({
            success: res => {
              console.log(res)
              wx.setStorageSync("userInfo", res.userInfo)
              // 可以将 res 发送给后台解码出 unionId

              //跳转埋点
              let now = new Date().getTime();
              addition.timestamp = now;
              addition.from = "V1.0_home_card_" + (e.currentTarget.dataset.index+1);
              addition.id = e.currentTarget.dataset.id;
              var addistr = JSON.stringify(addition);
              dot.customEvent({
                event: '查看文章',
                category: '动作信息打点',
                addition: addistr,
              })


            },
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '需要先授权哦！',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                // console.log('用户点击确定')
              }
            }
          })
        }
      }
    })

  },

  location: function () {
    var that = this
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户已经同意
              wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                  console.log(res)
                  var latitude = res.latitude
                  var longitude = res.longitude
                  // 调用接口 转化成详细位置信息
                  qqmapsdk.reverseGeocoder({
                    location: {
                      latitude: latitude,
                      longitude: longitude
                    },
                    success: function (res) {
                      console.log(res)
                      console.log(res.result.address_component.province);
                      var adress = res.result.address_component.province;
                      adress = adress.substr(0, adress.length - 1);  //去掉最后一个省字
                      console.log(typeof adress)
                      console.log(adress)
                      that.setData({
                        location: adress
                      })
                    },
                    fail: function (res) {
                      console.log(res);
                    },
                  });
                }
              })
            },
            fail: function (res) {
              //拒绝授权时会弹出提示框，提醒用户需要授权
              wx.showModal({
                title: '提示',
                content: '获取地理位置需要授权，是否去授权',
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: function (res) {
                        console.log(res);
                      }
                    })
                  }
                }
              })
            }
          })
        }
        else {
          // 用户已经同意
          wx.getLocation({
            type: 'wgs84',
            success: function (res) {
              console.log(res)
              var latitude = res.latitude
              var longitude = res.longitude
              // 调用接口 转化成详细位置信息
              qqmapsdk.reverseGeocoder({
                location: {
                  latitude: latitude,
                  longitude: longitude
                },
                success: function (res) {
                  console.log(res)
                  console.log(res.result.address_component.province);
                  var adress = res.result.address_component.province;
                  adress = adress.substr(0, adress.length - 1);  //去掉最后一个省字
                  console.log(typeof adress)
                  console.log(adress)
                  that.setData({
                    location: adress
                  })
                },
                fail: function (res) {
                  console.log(res);
                },
              });
            }
          })
        }
      }
    })
  },
})
