const App = getApp();
Page({
    data: {
        isBindTel: true, // 是否绑定手机号，控制按钮隐藏显示
        tipsMsg: true, // 消息提醒框是否隐藏
        noBind:false,        // 未绑定手机号
        moneyType: [{
                label: '账户余额',
                value: '123.00'
            },
            {
                label: '消费记录',
                value: '10'
            },
            {
                label: '当前积分',
                value: '120'
            },
        ],
        rechargeList: [{
                label: '充20送5',
                value: '1'
            },
            {
                label: '充30送10',
                value: '2'
            },
            {
                label: '充50送20',
                value: '3'
            },
            {
                label: '充100送40',
                value: '4'
            },
            {
                label: '充200送80',
                value: '5'
            },
            {
                label: '充500送100',
                value: '6'
            }

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
    // 隐藏消息提醒
    hideTipsMsg() {
        let that = this
        that.setData({
            tipsMsg: false
        })
    }

})