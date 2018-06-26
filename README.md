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
      
      getUserInfo: function(e) {
          
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
