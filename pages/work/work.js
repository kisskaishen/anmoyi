//index.js
const App = getApp();
var t;
Page({
  data: {
    startinfo:null,
    time:'启动按摩椅中...',
    iscountdown:false,
    cnumber: ''
  },
  onLoad: function (options) {
    this.getStartTime(options)
    this.setData({cnumber:App.globalData.cnumber})
    wx.setNavigationBarTitle({
      title: '启动按摩椅中'
    })
  },
  onShow:function(){
    
  },
  onHide:function(){
     
  },
  getStartTime:function(opt) {
    let self = this;
    let getTime = setInterval(function(){
      wx.request({
        url: App.globalData.Config.Host + 'Startchair/getstarttime',
        data: { pid: opt.pid },
        success: (res) => {
          if (res.starttime>0){
            clearInterval(getTime);
            self.setData({ startinfo: res.data });
            self.countDown(res.data);
            wx.setNavigationBarTitle({
              title: '启动成功'
            })
          }
        }
      })
    },2000);
  },
  settimecount:function() {

  },
  countDown: function (dt) {
    var self = this;
    let stime = dt.starttime;
    let usetime = dt.usetime*60;
    let nowtime = Date.parse(new Date()) / 1000;
    // let leftTime = stime + usetime - nowtime;
    let leftTime = 10;
    let t = setInterval(()=>{
      leftTime--;
      if(leftTime<=0){
        clearInterval(t);
        self.setData({ time: '期待您的再次使用', iscountdown:false});
      }else{
        self.setData({ time: timeLeftFun(leftTime), iscountdown:true});

      }
      console.log(123)
    }, 1000);
    
    function timeLeftFun(leftTime){
      var hours = parseInt(leftTime / 60 / 60 % 24, 10) > 9 ? parseInt(leftTime / 60 / 60 % 24, 10) : '0' + parseInt(leftTime / 60 / 60 % 24, 10)
      var minutes = parseInt(leftTime / 60 % 60, 10) > 9 ? parseInt(leftTime / 60 % 60, 10) : '0' + parseInt(leftTime / 60 % 60, 10);
      var seconds = parseInt(leftTime % 60, 10) > 9 ? parseInt(leftTime % 60, 10) : '0' + parseInt(leftTime % 60, 10);
      return hours + ':' + minutes + ':' + seconds;
    }
  }
 
})
