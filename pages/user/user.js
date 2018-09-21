const App = getApp();
Page({
    data: {
        moneyType:[
            { label: '账户余额', value: '123.00' },
            { label: '消费记录', value: '10' },
            { label: '当前积分', value: '120' },
        ],
        rechargeList:[
            { label: '充20送5', value: '1' },
            { label: '充30送10', value: '2' },
            { label: '充50送20', value: '3' },
            { label: '充100送40', value: '4' },
            { label: '充200送80', value: '5' },
            { label: '充500送100', value: '6' },
            { label: '充100送40', value: '7' },
            { label: '充200送80', value: '8' },
            { label: '充500送100', value: '9' },
            
        ]
    },
    onLoad: function(options) {
        
    },
    onReady: function() {

    },
    onShow: function() {

    },
    onHide: function() {

    },
    onUnload: function() {

    },
    dologin: function() {
        wx.navigateTo({
            url: '/pages/login/login',
        })
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
    bindTel() {}

})