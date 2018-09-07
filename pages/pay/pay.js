const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const App = getApp();

Page({
  data: {
    payIsReady: false,
    chair: null,
    active:0,
    footer: {
      active: ""
    }
  },
  onLoad: function (options) {
    if (options.cnumber !== undefined) {
      this.getPrice(options.cnumber);
      wx.setNavigationBarTitle({
        title: '当前按摩椅编号: ' + options.cnumber
      })
    }
  },

  getPrice: function (cnumber) {
    wx.request({
      url: App.globalData.Config.Host + 'Cinema/getprice',
      data: { number: cnumber },
      success: (res) => {
        this.setData({ chair: res.data, payIsReady: true })
      }
    })
  },
  chooseItem: function (e) {
    this.setData({ active: e.currentTarget.dataset.idx, loading: true });
  },
  //统一下单后调起支付
  payment: function () {
    let self = this;
    wx.request({
      url: App.globalData.Config.Host + 'Weixpay/pay',
      data: {
        chair: this.data.chair.cnumber,
        session_id: App.globalData.session_id
      },
      success: (res) => {
        console.log(res);
        if (res.data != 'error') {
          // requestPayment(res.data);
          wx.redirectTo({
            url: '/pages/work/work?pid=' + res.data.pid
          })
        } else {
          this.setData({ loading: false });
        }
      },
      fail: (res) => {
        this.setData({ loading: false });
      }
    })
    //调起支付
    function requestPayment(paydata) {
      wx.requestPayment({
        'timeStamp': paydata.timeStamp.toString(),
        'nonceStr': paydata.nonceStr,
        'package': paydata.package,
        'signType': paydata.signType,
        'paySign': paydata.paySign,
        success: (res) => {

        },
        fail: (res) => {

        },
        complete: (res) => {
          self.setData({ loading: false });
        }
      })
    }
  }
})