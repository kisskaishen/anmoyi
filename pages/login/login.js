// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oninput:false,
    inputdata:"",
    mobile:"",
    codefocus:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },


  inputmobile:function(e){
    if(e.detail.value.length>0){
      this.setData({ oninput:true});
    }
    if (e.detail.value.length==11){
      this.setData({mobile:e.detail.value});
    }
  },
  clearinput:function(){
    this.setData({ inputdata:""})
  },
  inputcode:function(e){
    if (e.target.dataset.idx && e.detail.value != "" && e.target.dataset.idx!="4"){
      this.setData({ codefocus: e.target.dataset.idx});
    }
    if (e.detail.value == ""){
      let cf = this.data.codefocus == "0" ? "0" : this.data.codefocus - 1;
      this.setData({codefocus:cf});
    }
    this.setData({
      ["ipd" + e.target.dataset.idx]: e.detail.value
    })

    let ipdata = this.data.ipd1 + '' + this.data.ipd2 + '' + this.data.ipd3 + '' + this.data.ipd4;
    ipdata = ipdata.replace(/undefined/g,"")
    if(ipdata.length==4){
      console.log(123123123)
    }
  },
  doreturn:function(){
    this.setData({mobile:""});
  }

})