const App = getApp();
Page({
  data: {
    latitude: null,
    longitude: null,
    markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'T.I.T 创意园'
    }],
  },
  onLoad: function (option) {
    this.setData({
      latitude:option.lat,
      longitude:option.lon
    })
    console.log(option)
    var mapCtx = wx.createMapContext(myMap)
    var latitude, longitude;
    mapCtx.getCenterLocation({
      success: function (res) {
        latitude = res.latitude;
        longitude = res.longitude;
      }
    }) //获取当前地图的中心经纬度
    // mapCtx.includePoints({
    //   padding: [10],
    //   points: [{
    //     latitude: latitude 
    //     longitude: longitude
    //   }]
    // })
    mapCtx.translateMarker({
      markerId: 0,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude: latitude,
        longitude: longitude,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  }
  
})
