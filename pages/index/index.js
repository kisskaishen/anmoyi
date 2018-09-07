const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const App = getApp();
Page({
  data: {
    cinemalist:[],
    footer:{
      active:"index"
    }
  },
  onLoad: function (options) {
    if (options.number !== undefined) {
      App.globalData.cnumber = options.number;
      wx.redirectTo({  url: '/pages/pay/pay?cnumber='+options.number })
    }
  },
  onReady: function () {
    
  },
  onShow: function () {
    this.getLocalAddr();
  },
  getLocalAddr: function () {
    console.log("获取地理信息");
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        let qqmapsdk = new QQMapWX({
          key: App.globalData.Config.Mapkey
        });
        return qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: (loc) => {
            this.setData({ Address: loc.result.address })
            this.getCinameList(loc.result.address_component);
          }
        });
      }
    })
  },
  getCinameList: function (loc) {
    wx.request({
      url: App.globalData.Config.Host + 'Cinema',
      data: { province: loc.province, city: loc.city },
      success: (res) => {
        this.setData({
          cinemalist: res.data
        })
      }
    })
  },
  chooseItem:function(e) {
    this.setData({ active: e.currentTarget.dataset.idx, loading: true});
  }
})