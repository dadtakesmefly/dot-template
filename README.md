    import dot from '../../../dotLib/dot'
    var deviceInfo = wx.getSystemInfoSync()
    var now = new Date().getTime();
    var addition = {
      "timestamp": now,
      "version": deviceInfo.version,
      "platform": deviceInfo.platform,
      "id": 0,
    };

      /**
      * dot config
      */

      __dot_page: function () {
        return {
          title: 'dot-config-title',
          category: 'user-info-dot',
          addition: '',
        }
      },
      onLoad: function () {
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

                  //dot
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


    })
