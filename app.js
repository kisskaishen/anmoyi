//app.js
const Config = require('config.js')
App({
    globalData: {
        Config,
        cnumber: null
    },
    onLaunch: function(options) {
        this.checkSession();
    },

    checkSession: function() {
        let self = this;
        wx.checkSession({
            success: (res) => {
                let session_id = wx.getStorageSync('session_id');
                if (session_id) {
                    this.globalData.session_id = session_id;
                } else {
                    this.getSessionId();
                }
            },
            fail: (res) => {
                this.getSessionId();
            }
        })
    },
    getSessionId: function() {
        wx.login({
            success: (res) => {
                console.log(res)
                if (res.code) {
                    wx.request({
                        url: this.globalData.Config.Host + 'login/onlogin',
                        data: {
                            code: res.code
                        },
                        success: (res) => {
                            this.globalData.session_id = res.data;
                            wx.setStorage({
                                key: 'session_id',
                                data: res.data,
                            })
                        }
                    })
                }
            }
        });
    }
})