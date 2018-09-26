//index.js
const App = getApp();
var t;
Page({
    data: {
        startinfo: null,
        time: '启动按摩椅中...',
        iscountdown: false,
        cnumber: '',
        endTime:'',             // 剩余时间
        totalTime:5,               // 总时间
    },
    onLoad: function(options) {
        let that = this
        that.getStartTime(options)
        that.setData({
            cnumber: App.globalData.cnumber
        })
        wx.setNavigationBarTitle({
            title: '启动按摩椅中'
        })
        let hour = '00'
        let minite = '00'
        let second = '00'

        let time = setInterval(()=>{
            if (that.data.totalTime>0) {
                
                hour = parseInt(that.data.totalTime / 60 / 60) < 10 ? '0' +parseInt(that.data.totalTime / 60 / 60) : parseInt(that.data.totalTime / 60 / 60)
                minite = parseInt(that.data.totalTime / 60 % 60) < 10 ? '0'+parseInt(that.data.totalTime / 60 % 60) : parseInt(that.data.totalTime / 60 % 60)
                second = that.data.totalTime % 60 < 10 ? '0'+that.data.totalTime % 60 : that.data.totalTime % 60
                that.setData({
                    totalTime: that.data.totalTime - 1,
                    endTime: `${hour}:${minite}:${second}`
                })
            } else {
                clearInterval(time)
                that.setData({
                    totalTime: 0,
                    endTime:'已停止'
                })
            }
        },1000)
    },
    onShow: function() {

    },
    onHide: function() {

    },
    getStartTime: function(opt) {
        let self = this;
        let getTime = setInterval(function() {
            wx.request({
                url: App.globalData.Config.Host + 'Startchair/getstarttime',
                data: {
                    pid: opt.pid
                },
                success: (res) => {
                    if (res.starttime > 0) {
                        clearInterval(getTime);
                        self.setData({
                            startinfo: res.data
                        });
                        self.countDown(res.data);
                        wx.setNavigationBarTitle({
                            title: '启动成功'
                        })
                    }
                }
            })
        }, 2000);
    },
    settimecount: function() {

    },
    countDown: function(dt) {
        var self = this;
        let stime = dt.starttime;
        let usetime = dt.usetime * 60;
        let nowtime = Date.parse(new Date()) / 1000;
        // let leftTime = stime + usetime - nowtime;
        let leftTime = 10;
        let t = setInterval(() => {
            leftTime--;
            if (leftTime <= 0) {
                clearInterval(t);
                self.setData({
                    time: '期待您的再次使用',
                    iscountdown: false
                });
            } else {
                self.setData({
                    time: timeLeftFun(leftTime),
                    iscountdown: true
                });

            }
            console.log(123)
        }, 1000);

        function timeLeftFun(leftTime) {
            var hours = parseInt(leftTime / 60 / 60 % 24, 10) > 9 ? parseInt(leftTime / 60 / 60 % 24, 10) : '0' + parseInt(leftTime / 60 / 60 % 24, 10)
            var minutes = parseInt(leftTime / 60 % 60, 10) > 9 ? parseInt(leftTime / 60 % 60, 10) : '0' + parseInt(leftTime / 60 % 60, 10);
            var seconds = parseInt(leftTime % 60, 10) > 9 ? parseInt(leftTime % 60, 10) : '0' + parseInt(leftTime % 60, 10);
            return hours + ':' + minutes + ':' + seconds;
        }
    }

})