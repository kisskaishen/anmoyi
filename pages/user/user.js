
const App = getApp();
Page({
  data: {
    footer: {
      active: "usercenter"
    },
    isLogin:false
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
  },
  onReady: function () {

  },
  onShow: function () {
    
  },
  onHide: function () {
  
  },
  onUnload: function () {
  
  },
  dologin:function(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  }

})