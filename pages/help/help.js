const App = getApp();

Page({
  data: {
    helplist:null
  },
  onLoad: function (options) {
    wx.request({
      url: App.globalData.Config.Host+'/help',
      success: (res)=> {
        this.setData({
          helplist:res.data
        })
      }
    })
  },
  itemclick:function(data) {
    let h = this.data.helplist[Number(data.currentTarget.dataset.index)].active || false;
    this.setData({
      ["helplist[" + data.currentTarget.dataset.index + "].active"]: !h
    })
  }
})
