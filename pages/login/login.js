const App = getApp();
Page({
    data: {
        closeImg: false, // 清除图标隐藏
        tel: '', // 输入手机号
        captcha: '', // 验证码
        isFocus: true,   // 获取焦点
        footer: {
            active: "usercenter"
        },
        isLogin: false
    },
    onLoad: function (options) {
        
    },
    onReady: function () {

    },
    onShow: function () {

    },
    onHide: function () {

    },
    onUnload: function () {

    },
    // 获取手机号的值
    getTelBind(e) {
        let that = this;
        that.setData({
            tel: e.detail.value,
            closeImg: true
        })
    },
    // 清除手机号
    clearTel() {
        let that = this;
        that.setData({
            tel: '',
            closeImg: false
        })
    },
    // 验证码
    Focus(e) {
        let that = this;
        let inputValue = e.detail.value;
        that.setData({
            captcha: inputValue,
        })
    },
    Tap() {
        let that = this;
        that.setData({
            isFocus: true,
        })
    },
    // 立即绑定
    bindTel() {
        wx.navigateTo({
            url: '/pages/user/user',
        })
    }

})