// pages/payOrder/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        rechargeList: [
            { label: '充20送5', value: '1' },
            { label: '充30送10', value: '2' },
            { label: '充50送20', value: '3' },
            { label: '充100送40', value: '4' },
            { label: '充200送80', value: '5' },
            { label: '充500送100', value: '6' }
        ],
        quanArr:[
            { label: '10元抵用券', value: '1' },
            { label: '20元抵用券', value: '2' },
        ],
        quanValue:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    // 抵用券使用
    quanChange(e) {
        let that = this;
        console.log(e)
        that.setData({
            quanValue:e.detail.value
        })
    }
})