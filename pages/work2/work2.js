//index.js
const App = getApp();
var t;
Page({
    data: {
        //第一版参数
        startChair: null,
        time: 0,
        timecount: 0,
        orderlist: {},
        cname: '点滴共享按摩椅',
        colorArr: { 0: '#ccc', 2: 'red' },

        product: 0,//产品类型1睡垫JH-N12C,2脚机JH-F12A,3脚机JH-F32，4靠垫JH-C12,5椅子M25
        openhex: "",
        jqisopen: true,
        endusetime: false,
        once: 0,
        platform: "",
        isonload: false,
        guanggao: "",

        //蓝牙部分//
        status: false,
        connectedDeviceId: "", 
        iosconnectedname: "", 
        services: "", 
        servicesarray: "", 
        characteristics: "",  
        writeServicweId: "",
        writeCharacteristicsId: "",
        readServicweId: "",
        readCharacteristicsId: "",
        notifyServicweId: "", 
        notifyCharacteristicsId: "",
        hex: "AA55050000000000000009C33C",
        ifreturn: false,
        sendtime: 1,
        sendchaxuntime: 1,
        exitflag: false,
        connectTime: 0,
        connectModal: 0,
        closepage: false,
        iffound: false,
        endtouse: false,

        //按摩椅控制部分//
        amystarflag: true,
        dicolor: "white",
        zcolor: "white",
        hcolor: "white",
        zdcount: 0,
        starflag: false,
        qbcolor: "orange",
        sbcolor: "orange",
        xbcolor: "orange",
        ddflag: false,
        ddqjflag: false,
        checkchudianflag: false,
        ddcolor: "orange",
        aucolor: "orange",
        adcolor: "orange",
        testcode: 0,
        init_hex: "AA55040100000000000009C33C",
        hotcolor: "orange",
        stopcolor: "orange",
        jscolor: "orange",
        jzcolor: "orange",
        jzflag: false,
        jstime: 0,

        //脚机控制器部分JH-F32
        qiangducolor: "orange",
        wenrecolor: "orange",
        moshicolor: "orange",
        zhendongcolor: "orange",
        kaiguancolor: "orange",
        jiaojihex: "AA55040100000000000009C33C",
        qiangdutime: 0,
        moshi1: "green",
        moshi2: "green",
        moshi3: "green",
        moshiflag: false,
        moshitime: 0,
        zhendongtime: 0,
        cdflag: true,
        qddcolor: "green",
        qdzcolor: "green",
        qdgcolor: "green",

        //睡垫控制部分JH-N12C
        sdzzcolor: "orange",
        sdfzcolor: "orange",
        sdzdcolor: "orange",
        sdddcolor: "orange",
        sdsdcolor: "orange",
        sddcolor: "green",
        sdzcolor: "green",
        sdgcolor: "green",
        sdrlcolor: "orange",
        sdztcolor: "orange",
        sdsuducount: 0,
        shuidianhex: "AA55040000000000000009C33C",

        //靠垫JH-C12控制部分
        c12jbmscolor:"orange",
        c12jbsdcolor:"orange",
        c12jbzdcolor:"orange",
        c12mscolor:"orange",
        c12ybcolor:"orange",
        c12rncolor:"orange",
        c12zdcolor:"orange",
        c12rlcolor:"orange",
        c12ztcolor:"orange",
        c12dcolor:"green",
        c12zcolor:"green",
        c12gcolor:"green",
        c12sdcount:0,
        c12zdcount:0,
        c12hex:"AA55040100000000000009C33C",
    },
    onLoad: function (options) {
        var that = this;
        that.setData({ startChair: wx.getStorageSync('startChair') });
        console.log("从本地获取startChair：", that.data.startChair);
        that.setData({
            connectedDeviceId: that.data.startChair.connectedDeviceId,
            iosconnectedname: that.data.startChair.localName
        });
        // wx.request({
        //     url: App.globalData.Config.Host + 'Pub/guanggao',
        //     success: (res) => {
        //         this.setData({
        //             guanggao: res.data.data[1].wenben
        //         });
        //         console.log(this.data.guanggao);
        //     }
        // })
        if (that.data.startChair.usetime) {
            if (that.data.startChair.usetime > 0) {
                let usetime = that.data.startChair.usetime;
                if (usetime < 10) {
                    usetime = "0" + (usetime + "");
                }
                that.setData({
                    openhex: "AA550101" + usetime + "000000000009C33C"
                })
            }
        }
        //获取系统信息
        wx.getSystemInfo({
            success: function (res) {
                var sys = res.platform;
                that.setData({
                    platform: sys,
                    isonload: true
                })
            }
        })

        this.countDown();
        this.getCname();

        if (that.data.time != 0) {
            that.step6();
        }
    },
    onShow: function () {
        // this.getOrderList();
        if (!this.data.isonload) {
            console.log("onshow--countDown");
            this.countDown();
        }
        this.setData({
            isonload: false
        });
    },
    onHide: function () {
        console.log("onHide--clearcountDown");
        clearInterval(t);
    },
    getCname: function () {
        wx.request({
            url: App.globalData.Config.Host + 'Getorderlist/getcinema',
            data: { mcode: this.data.startChair.localName },
            success: (res) => {
                this.setData({
                    cname: res.data
                });
            }
        })
    },
    countDown: function () {
        var self = this;
        let stime = this.data.startChair.startTime;
        let usetime = this.data.startChair.usetime * 60;
        let nowtime = Date.parse(new Date()) / 1000;
        let leftTime = stime + usetime - nowtime;
        if (leftTime <= 0) {
            self.setData({
                time: "欢迎下次使用",
                product: 0,
                endtouse: true,
                endusetime: true
            });
            wx.clearStorage();
            console.log("使用时间到1");
            self.step8();
            return
        }
        timeLeftFun(leftTime);
        t = setInterval(() => {
            timeLeftFun(leftTime);
            leftTime--;
            if (leftTime <= 0) {
                clearInterval(t);
                wx.clearStorage();
                self.setData({
                    endtouse: true,
                    endusetime: true,
                    time: "欢迎下次使用",
                    product: 0
                });
                console.log("使用时间到2");
                self.step8();
            }
        }, 1000);

        function timeLeftFun(leftTime) {
            var hours = parseInt(leftTime / 60 / 60 % 24, 10) > 9 ? parseInt(leftTime / 60 / 60 % 24, 10) : '0' + parseInt(leftTime / 60 / 60 % 24, 10)
            var minutes = parseInt(leftTime / 60 % 60, 10) > 9 ? parseInt(leftTime / 60 % 60, 10) : '0' + parseInt(leftTime / 60 % 60, 10);
            var seconds = parseInt(leftTime % 60, 10) > 9 ? parseInt(leftTime % 60, 10) : '0' + parseInt(leftTime % 60, 10);
            self.setData({ time: hours + ':' + minutes + ':' + seconds })
        }
    },
    getOrderList: function () {
        wx.request({
            url: App.globalData.Config.Host + 'Getorderlist',
            data: { session_id: App.globalData.session_id },
            success: (res) => {
                this.setData({ orderlist: res.data });
            }
        })
    },

    // 初始化蓝牙适配器  
    step1: function () {
        var that = this;
        wx.openBluetoothAdapter({
            success: function (res) {
                //开始连接
                that.step3();
            },
            fail: function (err) {
                console.log(err);
                wx.showToast({
                    title: '蓝牙未开启',
                    icon: 'none',
                    duration: 2000
                })
                setTimeout(function () {
                    that.step1();
                }, 3000)
            }
        })
    },
    //搜索设备  
    step3: function () {
        console.log("step3-menu");
        var that = this;
        wx.startBluetoothDevicesDiscovery({
            success: function (res) {
                setTimeout(function () {
                    that.step4();
                }, 1000)
            },
            fail: function () {
                that.step1();
            }
        })
    },
    // 获取所有已发现的设备  
    step4: function () {
        console.log("step4-menu");
        var that = this;
        wx.getBluetoothDevices({
            success: function (res) {
                //如果是IOS就搜索设备名称
                console.log("搜索结果：", res);
                if (that.data.platform == "ios") {
                    console.log("that.data.iosconnectedname:" + that.data.iosconnectedname);
                    for (var i = 0; i < res.devices.length; i++) {
                        if (res.devices[i].localName != null) {
                            if (res.devices[i].localName.indexOf(that.data.iosconnectedname) != -1) {
                                console.log("获得连接ID：" + res.devices[i].deviceId);
                                that.setData({
                                    connectedDeviceId: res.devices[i].deviceId,
                                    iffound: true
                                })
                                setTimeout(function () {
                                    that.connectTO();
                                }, 1000)
                                return;
                            }
                        }
                    }
                    if (!that.data.iffound) {
                        setTimeout(function () {
                            console.log("再次搜索周边设备");
                            that.step4();
                        }, 1000)
                    }
                } else {
                    //如果是安卓就直接连接
                    setTimeout(function () {
                        that.connectTO();
                    }, 1000)
                }
            }
        })
    },
    //连接设备  
    connectTO: function (e) {
        console.log("connectTO-work");
        var that = this;
        console.log("that.data.connectedDeviceId" + that.data.connectedDeviceId);
        wx.createBLEConnection({
            deviceId: that.data.connectedDeviceId,
            success: function (res) {
                wx.stopBluetoothDevicesDiscovery({
                    success: function (res) {
                        console.log("停止搜索周边设备");
                    }
                })
                wx.onBLEConnectionStateChange(function (res) {
                    // 该方法回调中可以用于处理连接意外断开等异常情况
                    //res.deviceId//蓝牙设备 id，参考 device 对象
                    //res.connected//连接目前的状态
                    if (!res.connected) {
                        console.log("监听到蓝牙已断开onBLEConnectionStateChange", res.deviceId);
                        // that.connectTO();
                    }
                })
                that.step6();
                that.setData({
                    status: true
                })
            },
            fail: function (res) {
                console.log("连接失败:", res);
                if (that.data.connectedDeviceId == null && that.data.connectModal == 0) {
                    that.setData({
                        status: false
                    })
                    return;
                }
                setTimeout(function () {
                    var connectTimee = that.data.connectTime;
                    if (that.data.status) {
                        return;
                    }
                    if (connectTimee == 3) {
                        return;
                    }
                    that.setData({
                        connectTime: connectTimee + 1
                    })
                    that.connectTO();
                }, 2000)
            }
        })
    },
    // 获取连接设备的service服务  
    step6: function () {
        console.log('step6')
        var that = this;
        wx.getBLEDeviceServices({
            deviceId: that.data.connectedDeviceId,
            success: function (res) {
                console.log('device services:', JSON.stringify(res.services));
                that.setData({
                    services: res.services
                })
                var arrayuuid = new Array();
                for (var i = 0; i < res.services.length; i++) {
                    arrayuuid.push(res.services[i].uuid);
                }
                that.setData({
                    servicesarray: arrayuuid
                })
                that.step7();
            },
            fail: function (res) {
                console.log('获取services失败:', res);
                that.step1();
            }
        })
    },
    //获取连接设备的所有特征值 
    step7: function () {
        console.log('step7')
        var that = this;
        wx.getBLEDeviceCharacteristics({
            deviceId: that.data.connectedDeviceId,
            serviceId: that.data.services[0].uuid,
            success: function (res) {
                for (var i = 0; i < res.characteristics.length; i++) {
                    if (res.characteristics[i].properties.notify) {
                        that.setData({
                            notifyServicweId: that.data.services[0].uuid,
                            notifyCharacteristicsId: res.characteristics[i].uuid
                        })
                    }
                    if (res.characteristics[i].properties.write) {
                        that.setData({
                            writeServicweId: that.data.services[0].uuid,
                            writeCharacteristicsId: res.characteristics[i].uuid
                        })

                    } else if (res.characteristics[i].properties.read) {
                        that.setData({
                            readServicweId: that.data.services[0].uuid,
                            readCharacteristicsId: res.characteristics[i].uuid
                        })
                    }
                }
                console.log('device getBLEDeviceCharacteristics:', res.characteristics);
            },
            fail: function (res) {
                console.log('获取services失败:', res);
                that.step1();
            }
        })
        //操作系统兼容处理
        if (that.data.platform != "ios") {
            console.log("comein")
            wx.getBLEDeviceCharacteristics({
                deviceId: that.data.connectedDeviceId,
                serviceId: that.data.services[1].uuid,
                success: function (res) {
                    console.log("get" + that.data.services[1].uuid);
                    for (var i = 0; i < res.characteristics.length; i++) {
                        if (res.characteristics[i].properties.notify) {
                            that.setData({
                                notifyServicweId: that.data.services[1].uuid,
                                notifyCharacteristicsId: res.characteristics[i].uuid
                            })
                        }
                        if (res.characteristics[i].properties.write) {
                            that.setData({
                                writeServicweId: that.data.services[1].uuid,
                                writeCharacteristicsId: res.characteristics[i].uuid
                            })
                        } else if (res.characteristics[i].properties.read) {
                            that.setData({
                                readServicweId: that.data.services[1].uuid,
                                readCharacteristicsId: res.characteristics[i].uuid
                            })
                        }
                    }
                },
                fail: function () {
                    console.log("获取特征值失败");
                }
            })
        }
        //必须延时后发送
        setTimeout(function () {
            that.step9();
        }, 1000)
    },
    //发送  
    step8: function () {
        console.log('step8')
        var that = this;
        if (that.data.once == 0) {
            var hex = that.data.hex;
        } else {
            if (that.data.product == 1) {
                console.log("睡垫N12C")
                var hex = that.data.shuidianhex;
            } else if (that.data.product == 2) {
                console.log("脚机F12A");

            } else if (that.data.product == 3) {
                console.log("脚机F32A-1");
                var hex = that.data.jiaojihex;

            }else if(that.data.product==4){
                console.log("靠垫JH-C12");
                var hex=that.data.c12hex;
            } else if (that.data.product == 5) {
                console.log("椅子M25");
                var hex = that.data.init_hex;
            }
        }

        if (that.data.endtouse) {
            console.log("用户结束使用");
            var hex = "AA55010100000000000009C33C";
        }

        // 判断机器是否付款后未开启
        if (!that.data.jqisopen) {
            if (!that.data.endusetime) {
                hex = that.data.openhex;
                that.setData({
                    jqisopen: true
                })
            }
        }
        var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
            return parseInt(h, 16)
        }))
        var buf = typedArray.buffer;
        //进行蓝牙通信
        wx.writeBLECharacteristicValue({
            deviceId: that.data.connectedDeviceId,
            serviceId: that.data.writeServicweId,
            characteristicId: that.data.writeCharacteristicsId,
            value: buf,
            success: function (res) {
                console.log('已发送指令：' + hex)
                that.setData({
                    ifreturn: false
                })
                that.step10();
                //2秒后未收到回复提示设备有故障
                setTimeout(function () {
                    console.log("是否收到:" + that.data.ifreturn);
                    if (!that.data.ifreturn) {
                        var sendtime = that.data.sendtime;
                        if (sendtime == 3) {
                            return;
                        }
                        that.step8();
                        that.setData({
                            sendtime: sendtime + 1
                        })
                    } else {
                        return;
                    }
                }, 3000)
            },
            fail: function (res) {
                console.log('发送失败:', res)
                that.step1();
            }
        })
    },
    //发送查询是否到达触点  
    checkchudian: function (e) {
        var that = this;
        var hex = "AA55020000000000000009C33C";
        var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
            return parseInt(h, 16)
        }))
        var buf = typedArray.buffer;
        //进行蓝牙通信
        wx.writeBLECharacteristicValue({
            deviceId: that.data.connectedDeviceId,
            serviceId: that.data.writeServicweId,
            characteristicId: that.data.writeCharacteristicsId,
            value: buf,
            success: function (res) {
                console.log('已发送触点查询指令：' + hex);
                that.jieshouchudian(e);
            },
            fail: function (res) {
                console.log('发送触点查询指令失败--重新连接:', res)
                that.step1();
            }
        })
    },
    //启用低功耗蓝牙设备特征值变化时的 notify 功能  
    step9: function () {
        console.log('step9')
        var that = this;
        wx.notifyBLECharacteristicValueChange({
            state: true,
            deviceId: that.data.connectedDeviceId,
            serviceId: that.data.notifyServicweId,
            characteristicId: that.data.notifyCharacteristicsId,
            success: function (res) {
                setTimeout(function () {
                    that.step8();
                }, 1000)
            },
            fail: function (res) {
                console.log('fail：', res);
                that.connectTO();
            }
        })
    },
    //查询触点接收消息  
    jieshouchudian: function (e) {
        var that = this;
        // 必须在这里的回调才能获取  
        wx.onBLECharacteristicValueChange(function (characteristic) {
            let hex = Array.prototype.map.call(new Uint8Array(characteristic.value), x => ('00' + x.toString(16)).slice(-2)).join('');
            console.log("触点查询收到指令:" + hex);

            //判断产品为按摩椅
            if (that.data.product == 1) {
                //判断定点区间标志是否开启
                if (hex.charAt(13) == 1 && hex.charAt(5) == 2) {
                    console.log("定点区间标志--开启");
                    that.setData({
                        ddqjflag: true
                    })
                } else if (hex.charAt(13) == 0 && hex.charAt(5) == 2) {
                    console.log("定点区间标志--关闭");
                    that.setData({
                        ddqjflag: false
                    })
                }
                that.changeanmo(e);
            }
        })
    },
    //接收消息  
    step10: function () {
        console.log('step10')
        var that = this;
        //操作系统兼容性处理
        if (that.data.platform != "ios" && that.data.once == 0) {
            console.log("readBLECharacteristicValue111")
            wx.readBLECharacteristicValue({
                deviceId: that.data.connectedDeviceId,
                serviceId: that.data.readServicweId,
                characteristicId: that.data.readCharacteristicsId,
                success: function (res) {
                }
            })
        }
        // 必须在这里的回调才能获取  
        wx.onBLECharacteristicValueChange(function (characteristic) {
            let hex = Array.prototype.map.call(new Uint8Array(characteristic.value), x => ('00' + x.toString(16)).slice(-2)).join('');
            console.log("接收指令:" + hex);
            if (hex.length < 25) {
                console.log("返回数据不全");
                return;
            } else {
                if (hex.substr(4, 2) != "83") {
                    that.setData({
                        ifreturn: true
                    })
                }
            }
            //判断是否第一次进入
            if (that.data.once == 0 && hex.charAt(5) == 5) {
                console.log("第一次进入")
                //判断消息内容是否正确
                if (hex.charAt(9) == 1) {
                    that.setData({
                        check: true,
                        once: 1,
                        connectflag: true,
                        jqisopen: true,
                        turnhex: 1
                    })
                } else if (hex.charAt(9) == 3) {
                    that.setData({
                        check: true,
                        once: 1,
                        connectflag: true,
                        jqisopen: false,
                        turnhex: 1
                    })
                    that.step8();
                }
                //判断产品型号
                if (hex.substr(10, 10) == "0101010101") {
                    console.log("产品为睡垫N12C");
                    that.setData({
                        product: 1
                    })
                    //开机默认加热，自动,高档
                    that.shuidianzd();
                    that.shuidianrl();
                } else if (hex.substr(10, 10) == "0202020202") {
                    console.log("产品为脚机F12A");
                    that.setData({
                        product: 2
                    })

                } else if (hex.substr(10, 10) == "0303030303") {
                    console.log("产品为脚机F32A-1");
                    that.setData({
                        product: 3
                    })
                    //如果是脚机，开启模式一和加热
                    that.moshi();
                    that.wenre();
                } else if (hex.substr(10, 10) == "0404040404") {
                    console.log("产品为靠垫JH-C12-1");
                    that.setData({
                        product: 4
                    })
                    //开机默认打开颈部自动，背部揉捏，加热，振动低
                    that.c12jbzd();
                    that.c12bbrn();
                    that.c12rl();
                    that.c12zd();
                    that.c12zd();
                    that.c12zd();
                } else if (hex.substr(10, 10) == "0505050505") {
                    console.log("产品为椅子M25");
                    that.setData({
                        product: 5
                    })
                    that.amyinit();
                } 
            }   
        })
    },
    //替换指定位置的字符串
    replacePos: function (source, pos, newChar) {
        var iBeginPos = 0, iEndPos = source.length;
        var sFrontPart = source.substr(iBeginPos, pos);
        var sTailPart = source.substr(pos + 1, source.length);
        var sRet = sFrontPart + newChar + sTailPart;
        return sRet;
    },
    endsend: function () {
        var that = this;
        wx.showModal({
            title: '是否结束使用按摩椅',
            content: '点击确定结束使用后，按摩椅将会停止运行，剩余套餐时间不会给予退费，可扫码付费后继续使用',
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定-work');
                    that.setData({
                        endtouse: true,
                        time: "欢迎下次使用",
                        product: 0
                    });
                    console.log("product:" + that.data.product);
                    that.step8();
                    clearInterval(t);
                    wx.clearStorage();

                }
            }
        })
    },
    //-------------按摩椅控制板部分--------------
    //控制程序入口
    //按摩椅初始化,开机默认开启颈部正转，全程，加热，震动强 
    amyinit: function () {
        var that = this;
        var hex = that.data.init_hex;
        //颈部正转
        hex = that.replacePos(hex, 15, "2");
        //全程
        hex = that.replacePos(hex, 7, "3");
        //加热
        hex = that.replacePos(hex, 10, "8");
        //震动强
        hex = that.replacePos(hex, 11, "4");
        that.setData({
            jscolor: "red",
            jzcolor: "orange",
            jstime: 1,
            qbcolor: "red",
            sbcolor: "orange",
            xbcolor: "orange",
            hotcolor: "red",
            dicolor: "white",
            zcolor: "white",
            hcolor: "red",
            zdcount: 4,
            init_hex: hex
        })

    },
    //点击振动
    changezd: function (e) {
        var that = this;
        //未开启时，此按键不起效
        if (that.data.starflag) {
            return;
        }
        var id = e.currentTarget.id;
        var hex = that.data.init_hex;
        var zcount = that.data.zdcount;
        var zhcount = zcount + 1;
        if (zhcount == 1) {
            hex = that.replacePos(hex, 11, "1");
            that.setData({
                dicolor: "red",
                zcolor: "white",
                hcolor: "white",
                zdcount: zhcount,
                init_hex: hex
            })
        } else if (zhcount == 2) {
            hex = that.replacePos(hex, 11, "2");
            that.setData({
                dicolor: "white",
                zcolor: "red",
                hcolor: "white",
                zdcount: zhcount,
                init_hex: hex
            })
        } else if (zhcount == 3) {
            hex = that.replacePos(hex, 11, "4");
            that.setData({
                dicolor: "white",
                zcolor: "white",
                hcolor: "red",
                zdcount: zhcount,
                init_hex: hex
            })
        } else if (zhcount > 3) {
            hex = that.replacePos(hex, 11, "0");
            that.setData({
                dicolor: "white",
                zcolor: "white",
                hcolor: "white",
                zdcount: 0,
                init_hex: hex
            })
        }

        that.amysendhex();
    },
    //暂停
    tipsend: function () {
        var that = this;
        var flag = that.data.starflag;
        if (flag) {
            //开启
            that.setData({
                starflag: false,
                init_hex: "AA55040100000000000009C33C",//初始化指令
                stopcolor: "orange",//加热按键
            })
        } else {
            //停止
            that.setData({
                starflag: true,
                init_hex: "AA55040100000000000009C33C",
                dicolor: "white",
                zcolor: "white",
                hcolor: "white",
                zdcount: 0,
                qbcolor: "orange",
                sbcolor: "orange",
                xbcolor: "orange",
                ddflag: false,
                ddcolor: "orange",
                aucolor: "orange",
                adcolor: "orange",
                hotcolor: "orange",
                stopcolor: "red",
                jscolor: "orange",
                jzcolor: "orange",
                jzflag: false,
                ddqjflag: false,
                checkchudianflag: false,
                jstime: 0
            })
        }
        that.amysendhex();
    },
    //区域按键点击
    changequyu: function (e) {
        var that = this;
        //未开启时，此按键不起效
        if (that.data.starflag) {
            return;
        }
        var id = e.currentTarget.id;
        var hex = that.data.init_hex;
        //判断哪个按键颜色变化
        if (id == "bq") {
            //关闭全背
            if (that.data.qbcolor == "red") {
                that.setData({
                    qbcolor: "orange"
                })
            } else {
                //打开全背
                that.setData({
                    qbcolor: "red",
                    sbcolor: "orange",
                    xbcolor: "orange"
                })
            }
        } else if (id == "bs") {
            //关闭上背
            if (that.data.sbcolor == "red") {
                that.setData({
                    sbcolor: "orange"
                })
            } else {
                //打开上背
                that.setData({
                    qbcolor: "orange",
                    sbcolor: "red",
                    xbcolor: "orange"
                })
            }
        } else if (id == "bx") {
            //关闭下背
            if (that.data.xbcolor == "red") {
                that.setData({
                    xbcolor: "orange",
                })
            } else {
                //打开下背
                that.setData({
                    qbcolor: "orange",
                    sbcolor: "orange",
                    xbcolor: "red"
                })
            }
        }
        //根据按键颜色判断hex
        if (that.data.qbcolor == "red") {
            //打开全背
            hex = that.replacePos(hex, 7, "3");
        } else if (that.data.sbcolor == "red") {
            //打开上背
            hex = that.replacePos(hex, 7, "5");
            //当加热键打开时
        } else if (that.data.xbcolor == "red") {
            //打开下背
            hex = that.replacePos(hex, 7, "9");
        } else if (that.data.qbcolor == "orange" && that.data.xbcolor == "orange" && that.data.sbcolor == "orange") {
            //区域功能关闭
            hex = that.replacePos(hex, 7, "1");
        }

        //如果定点打开
        if (that.data.ddcolor == "red") {
            hex = that.replacePos(hex, 12, "0");
        }
        //如果向上打开
        if (that.data.aucolor == "red") {
            hex = that.replacePos(hex, 12, "0");
        }
        //如果向下打开
        if (that.data.adcolor == "red") {
            hex = that.replacePos(hex, 13, "0");
        }

        console.log("区域:" + hex)
        that.setData({
            init_hex: hex,
            ddcolor: "orange",
            adcolor: "orange",
            aucolor: "orange"
        })
        that.amysendhex();
    },
    //查询定点标志位是否开启
    checkisdd: function (e) {
        var that = this;
        var id = e.currentTarget.id;
        //未开启时，此按键不起效
        if (that.data.starflag) {
            return;
        }
        if (id != "dd") {
            wx.showLoading({
            });
            that.checkchudian(e);
        } else {
            that.changeanmo(e);
        }
    },
    //按摩按键
    changeanmo: function (e) {
        var that = this;
        var id = e.currentTarget.id;
        var hex = that.data.init_hex;
        //如果是定点按键
        if (id == "dd") {
            //定点按键是否打开
            if (that.data.ddcolor == "red") {
                that.setData({
                    ddflag: false,
                    ddcolor: "orange"
                })
            } else {
                that.setData({
                    ddflag: true,
                    ddcolor: "red",
                    aucolor: "orange",
                    adcolor: "orange"
                })
            }
            //如果是上按键
        } else if (id == "au") {
            //判断上按键是否打开
            if (that.data.aucolor == "red") {
                that.setData({
                    aucolor: "orange"
                })
            } else {
                //判断向下是否开启
                if (that.data.adcolor == "red") {
                    //判断定点区间标志位是否打开
                    if (that.data.ddqjflag) {
                        that.setData({
                            aucolor: "red",
                            ddcolor: "orange",
                            adcolor: "orange"
                        })
                    } else {
                        that.setData({
                            aucolor: "red",
                            ddcolor: "orange"
                        })
                    }

                } else {
                    that.setData({
                        aucolor: "red",
                        ddcolor: "orange",
                        adcolor: "orange"
                    })
                }
            }
            //如果是下按键
        } else if (id == "ad") {
            //判断下按键是否打开
            if (that.data.adcolor == "red") {
                that.setData({
                    adcolor: "orange"
                })
            } else {
                //判断向上是否开启
                if (that.data.aucolor == "red") {
                    //判断定点区间标志位是否打开
                    if (!that.data.ddqjflag) {
                        that.setData({
                            adcolor: "red",
                            ddcolor: "orange"
                        })
                    } else {
                        that.setData({
                            aucolor: "orange",
                            ddcolor: "orange",
                            adcolor: "red"
                        })
                    }
                } else {
                    that.setData({
                        aucolor: "orange",
                        ddcolor: "orange",
                        adcolor: "red"
                    })
                }
            }
        }
        //当定点打开时
        if (that.data.ddcolor == "red") {
            hex = that.replacePos(hex, 12, "2");
            hex = that.replacePos(hex, 13, "0");
        }
        //当向上打开时,向下关闭时
        if (that.data.aucolor == "red" && that.data.adcolor == "orange") {
            hex = that.replacePos(hex, 12, "1");
            hex = that.replacePos(hex, 13, "0");
        }
        //当向下打开时，向上关闭时
        if (that.data.adcolor == "red" && that.data.aucolor == "orange") {
            hex = that.replacePos(hex, 13, "8");
            hex = that.replacePos(hex, 12, "0");
        }
        //当向上、向下打开时
        if (that.data.aucolor == "red" && that.data.adcolor == "red") {
            hex = that.replacePos(hex, 12, "4");
            hex = that.replacePos(hex, 13, "0");
        }
        //当按摩全部关闭时
        if (that.data.ddcolor == "orange" && that.data.aucolor == "orange" && that.data.adcolor == "orange") {
            hex = that.replacePos(hex, 12, "0");
            hex = that.replacePos(hex, 13, "0");
        }
        //如果全背打开
        if (that.data.qbcolor == "red") {
            hex = that.replacePos(hex, 7, "1");
        }
        //如果上背打开
        if (that.data.sbcolor == "red") {
            hex = that.replacePos(hex, 7, "1");
        }
        //如果下背打开
        if (that.data.xbcolor == "red") {
            hex = that.replacePos(hex, 7, "1");
        }
        console.log("按摩:" + hex)
        that.setData({
            init_hex: hex,
            qbcolor: "orange",
            sbcolor: "orange",
            xbcolor: "orange"
        })
        that.amysendhex();
        wx.hideLoading();
    },
    //颈部按键按下
    jbup: function (e) {
        var that = this;
        if (that.data.starflag) {
            return;
        }
        var id = e.currentTarget.id;
        var hex = that.data.init_hex;
        if (id == "ju") {
            hex = that.replacePos(hex, 14, "8");
        } else if (id = "jd") {
            hex = that.replacePos(hex, 14, "4");
        }
        console.log("颈部按下:" + hex)
        that.setData({
            init_hex: hex
        })
        that.amysendhex();
    },
    //颈部按键离开
    jbdown: function (e) {
        var that = this;
        if (that.data.starflag) {
            return;
        }
        var id = e.currentTarget.id;
        var hex = that.data.init_hex;
        if (id == "ju") {
            hex = that.replacePos(hex, 14, "0");
        } else if (id = "jd") {
            hex = that.replacePos(hex, 14, "0");
        }
        console.log("颈部离开:" + hex)
        that.setData({
            init_hex: hex
        })
        that.amysendhex();
    },
    //颈部自动和手动按键
    jbauto: function (e) {
        var that = this;
        if (that.data.starflag) {
            return;
        }
        var id = e.currentTarget.id;
        var hex = that.data.init_hex;
        var jstime = that.data.jstime;
        //颈部手动
        if (id == "js") {
            //按一次正转
            if (jstime == 0) {
                that.setData({
                    jscolor: "red",
                    jzcolor: "orange",
                    jstime: 1
                })
                //按二次反转
            } else if (jstime == 1) {
                that.setData({
                    jstime: 2
                })
                //按三次关闭
            } else if (jstime == 2) {
                that.setData({
                    jscolor: "orange",
                    jstime: 0
                })
            }

            //颈部自动,关闭颈部正转，反转。开启颈部自动正反转
        } else if (id == "jz") {
            if (that.data.jzcolor == "red") {
                that.setData({
                    jzcolor: "orange"
                })
            } else {
                that.setData({
                    jscolor: "orange",
                    jzcolor: "red",
                    jstime: 0,//手动点击次数
                })
            }
        }
        //自动打开,关闭颈部正转，反转。开启颈部自动正反转
        if (that.data.jzcolor == "red") {
            console.log("颈部自动打开");
            hex = that.replacePos(hex, 15, "1");
        } else {
            //自动关闭
            if (that.data.jzcolor == "orange") {
                console.log("颈部自动关闭");
                hex = that.replacePos(hex, 15, "0");
            }
            //手动打开
            //手动第一次按下，打开正转
            if (that.data.jstime == 1) {
                hex = that.replacePos(hex, 15, "2");
                //手动第二次按下，打开反转
            } else if (that.data.jstime == 2) {
                hex = that.replacePos(hex, 15, "4");
                //手动第三次按下，关闭手动模式
            } else if (that.data.jstime == 0) {
                hex = that.replacePos(hex, 15, "0");
            }
        }




        console.log("模式：" + hex);
        that.setData({
            init_hex: hex
        })
        that.amysendhex();
    },
    //按下加热键
    changehot: function (e) {
        var that = this;
        if (that.data.starflag) {
            return;
        }
        var hex = that.data.init_hex;
        var hotcolor = that.data.hotcolor;
        if (hotcolor == "orange") {
            //开启加热
            hex = that.replacePos(hex, 10, "8");
            that.setData({
                hotcolor: "red",
                init_hex: hex
            })
        } else {
            //关闭加热
            hex = that.replacePos(hex, 10, "0");
            that.setData({
                hotcolor: "orange",
                init_hex: hex
            })
        }
        that.amysendhex();
    },
    //按摩椅发送指令方法
    amysendhex: function () {
        var that = this;
        if (!that.data.amystarflag) {
            return;
        }
        that.step8();
    },

    //-----------脚机控制板部分-----------
    jiaoji: function (e) {
        let id = e.currentTarget.id;
        var that = this;
        if (!that.data.cdflag) {
            console.log("按键冷却中");

            return;
        } else {
            that.setData({
                cdflag: false
            })
            setTimeout(function () {
                that.setData({
                    cdflag: true
                })
            }, 600)
        }

        //强度
        if (id == "qiangdu") {
            //判断开关是否打开
            if (this.data.kaiguancolor == "red") {
                console.log("开关未开启");
                return;
            }
            this.qiangdu();
            //温热
        } else if (id == "wenre") {
            //判断开关是否打开
            if (this.data.kaiguancolor == "red") {
                console.log("开关未开启");
                return;
            }
            this.wenre();
            //模式
        } else if (id == "moshi") {
            //判断开关是否打开
            if (this.data.kaiguancolor == "red") {
                console.log("开关未开启");
                return;
            }
            this.moshi();
            //振动
        } else if (id == "zhendong") {
            //判断开关是否打开
            if (this.data.kaiguancolor == "red") {
                console.log("开关未开启");
                return;
            }
            this.zhendong();
            //开关
        } else if (id == "kaiguan") {
            this.kaiguan();
        }

        that.step8();
    },
    //开关  
    kaiguan: function () {
        console.log("暂停");
        var that = this;
        let hex = that.data.jiaojihex;

        //点击暂停，暂停没开启，启用暂停
        if (that.data.kaiguancolor == "orange") {
            that.setData({
                qiangducolor: "orange",
                wenrecolor: "orange",
                moshicolor: "orange",
                zhendongcolor: "orange",
                kaiguancolor: "red",
                jiaojihex: "AA55040000000000000009C33C",
                qiangdutime: 0,
                moshi1: "green",
                moshi2: "green",
                moshi3: "green",
                moshiflag: false,
                moshitime: 0,
                zhendongtime: 0,
            })
        } else {
            that.setData({
                kaiguancolor: "orange",
                jiaojihex: "AA55040100000000000009C33C"
            })

            that.moshi();
            that.wenre();
        }
    },
    //强度
    qiangdu: function () {
        console.log("强度");
        var that = this;
        let hex = that.data.jiaojihex;
        let qiangdutime = that.data.qiangdutime;
        if (!that.data.moshiflag) {
            console.log("模式没开启");
            return;
        }

        //强度第一次按下  
        if (qiangdutime == 0) {
            hex = that.replacePos(hex, 11, "2");
            that.setData({
                qddcolor: "green",
                qdzcolor: "greenopen",
                qdgcolor: "green",
            })
            qiangdutime = 1;
        } else if (qiangdutime == 1) {
            hex = that.replacePos(hex, 11, "4");
            that.setData({
                qddcolor: "green",
                qdzcolor: "green",
                qdgcolor: "greenopen",
            })
            qiangdutime = 2;
        } else if (qiangdutime == 2) {
            hex = that.replacePos(hex, 11, "1");
            that.setData({
                qddcolor: "greenopen",
                qdzcolor: "green",
                qdgcolor: "green",
            })
            qiangdutime = 0;
        }

        that.setData({
            qiangducolor: "red",
            jiaojihex: hex,
            qiangdutime: qiangdutime
        })
    },
    //温热
    wenre: function () {
        console.log("温热");
        var that = this;
        let hex = that.data.jiaojihex;
        let wenrecolor = that.data.wenrecolor;
        //当温热没有打开时
        if (wenrecolor == "orange") {
            let changet = (parseInt(hex.charAt(6), 16) + 2).toString(16);
            hex = that.replacePos(hex, 6, changet);
            wenrecolor = "red";
            //当温热打开时
        } else {
            let changet = (parseInt(hex.charAt(6), 16) - 2).toString(16);
            hex = that.replacePos(hex, 6, changet);
            wenrecolor = "orange";
        }

        that.setData({
            wenrecolor: wenrecolor,
            jiaojihex: hex
        })
    },
    //模式
    moshi: function () {
        console.log("模式");
        var that = this;
        let hex = that.data.jiaojihex;
        let moshitime = that.data.moshitime;
        //模式第一次按下
        if (moshitime == 0) {
            //模式一打开，强度一打开，振动开启
            hex = that.replacePos(hex, 9, "1");
            hex = that.replacePos(hex, 11, "1");
            let changet = (parseInt(hex.charAt(6), 16) + 1).toString(16);
            hex = that.replacePos(hex, 6, changet);
            hex = that.replacePos(hex, 7, "1");
            that.setData({
                qddcolor: "greenopen",
                qdzcolor: "green",
                qdgcolor: "green",
                qiangducolor: "red",
                zhendongcolor: "red",
                moshicolor: "red",
                moshi1: "greenopen",
                moshi2: "green",
                moshi3: "green",
                jiaojihex: hex,
                zhendongtime: 0,
                qiangdutime: 0,
                moshitime: 1,
                moshiflag: true
            })
            //模式第二次按下，打开模式二，强度一打开，振动开启
        } else if (moshitime == 1) {
            hex = that.replacePos(hex, 9, "2");
            hex = that.replacePos(hex, 11, "1");
            //如果振动没有开启
            if (that.data.zhendongcolor == "orange") {
                let changet = (parseInt(hex.charAt(6), 16) + 1).toString(16);
                hex = that.replacePos(hex, 6, changet);
            }
            that.setData({
                qddcolor: "greenopen",
                qdzcolor: "green",
                qdgcolor: "green",
                qiangducolor: "red",
                zhendongcolor: "red",
                moshi1: "green",
                moshi2: "greenopen",
                moshi3: "green",
                jiaojihex: hex,
                qiangdutime: 0,
                moshitime: 2
            })
            //模式第三次按下，打开模式三，强度一打开，振动开启
        } else if (moshitime == 2) {
            hex = that.replacePos(hex, 9, "4");
            hex = that.replacePos(hex, 11, "1");
            //如果振动没有开启
            if (that.data.zhendongcolor == "orange") {
                let changet = (parseInt(hex.charAt(6), 16) + 1).toString(16);
                hex = that.replacePos(hex, 6, changet);
            }
            that.setData({
                qddcolor: "greenopen",
                qdzcolor: "green",
                qdgcolor: "green",
                qiangducolor: "red",
                zhendongcolor: "red",
                moshi1: "green",
                moshi2: "green",
                moshi3: "greenopen",
                jiaojihex: hex,
                qiangdutime: 0,
                moshitime: 3
            })
            //模式第四次按下，关闭模式，关闭振动，关闭强度
        } else if (moshitime == 3) {
            hex = that.replacePos(hex, 9, "0");
            hex = that.replacePos(hex, 11, "0");
            //判断振动是否关闭
            if (that.data.zhendongcolor == "red") {
                let changet = (parseInt(hex.charAt(6), 16) - 1).toString(16);
                hex = that.replacePos(hex, 6, changet);
            }
            that.setData({
                qddcolor: "green",
                qdzcolor: "green",
                qdgcolor: "green",
                qiangducolor: "orange",
                zhendongcolor: "orange",
                moshicolor: "orange",
                moshi1: "green",
                moshi2: "green",
                moshi3: "green",
                jiaojihex: hex,
                qiangdutime: 0,
                moshitime: 0,
                moshiflag: false
            })
        }
    },
    //振动
    zhendong: function () {
        console.log("振动");
        var that = this;
        let hex = that.data.jiaojihex;
        let moshiflag = that.data.moshiflag;
        let zhendongtime = that.data.zhendongtime;

        //模式开启时
        if (moshiflag) {
            //如果振动开启时按下，关闭振动
            if (that.data.zhendongcolor == "red") {
                let changet = (parseInt(hex.charAt(6), 16) - 1).toString(16);
                hex = that.replacePos(hex, 6, changet);
                that.setData({
                    zhendongcolor: "orange",
                    jiaojihex: hex
                })
                //如果振动关闭时按下，打开振动
            } else {
                let changet = (parseInt(hex.charAt(6), 16) + 1).toString(16);
                hex = that.replacePos(hex, 6, changet);
                that.setData({
                    zhendongcolor: "red",
                    jiaojihex: hex
                })
            }

            //模式没开启时
        } else {
            //振动第一次按下
            if (zhendongtime == 0) {
                hex = that.replacePos(hex, 7, "3");
                zhendongtime = 1;
                //振动第二次按下
            } else if (zhendongtime == 1) {
                hex = that.replacePos(hex, 7, "5")
                zhendongtime = 2;
                //振动第三次按下   
            } else if (zhendongtime == 2) {
                hex = that.replacePos(hex, 7, "9");
                zhendongtime = 0;
            }

            that.setData({
                zhendongcolor: "red",
                jiaojihex: hex,
                zhendongtime: zhendongtime
            })
        }
    },

    //-------------睡垫控制板部分--------------
    //控制程序入口
    shuidian: function (e) {
        let id = e.currentTarget.id;
        var that = this;
        if (!that.data.cdflag) {
            console.log("按键冷却中");

            return;
        } else {
            that.setData({
                cdflag: false
            })
            setTimeout(function () {
                that.setData({
                    cdflag: true
                })
            }, 600)
        }

        //正转
        if (id == "zz") {
            //判断开关是否打开
            if (that.data.sdztcolor == "red") {
                console.log("开关未开启");
                return;
            }
            that.shuidianzz();

            //反转
        } else if (id == "fz") {
            //判断开关是否打开
            if (that.data.sdztcolor == "red") {
                console.log("开关未开启");
                return;
            }
            that.shuidianfz();

            //自动
        } else if (id == "zd") {
            //判断开关是否打开
            if (that.data.sdztcolor == "red") {
                console.log("开关未开启");
                return;
            }
            that.shuidianzd();

            //抖动
        } else if (id == "dd") {
            //判断开关是否打开
            if (that.data.sdztcolor == "red") {
                console.log("开关未开启");
                return;
            }
            that.shuidiandd();

            //速度
        } else if (id == "sd") {
            //判断开关是否打开
            if (that.data.sdztcolor == "red") {
                console.log("开关未开启");
                return;
            }
            if (that.data.sdzzcolor == "orange" && that.data.sdfzcolor == "orange" && that.data.sdzdcolor == "orange" && that.data.sdddcolor == "orange") {
                console.log("四个功能按键没有开启");
                return;
            }
            that.shuidiansd();

            //热疗
        } else if (id == "hot") {
            //判断开关是否打开
            if (that.data.sdztcolor == "red") {
                console.log("开关未开启");
                return;
            }
            that.shuidianrl();

            //暂停
        } else if (id == "stop") {
            that.shuidianstop();
        }

        that.step8();
    },
    //睡垫正转
    shuidianzz: function () {
        console.log("睡垫正转");
        var that = this;
        let hex = that.data.shuidianhex;

        //如果正转打开
        if (that.data.sdzzcolor == "red") {
            that.setData({
                sdzzcolor: "orange",
                sdsdcolor: "orange",
                sdsuducount: 0,
                sddcolor: "green",
                sdzcolor: "green",
                sdgcolor: "green"
            })
            //如果正转关闭  
        } else {
            that.setData({
                sdzzcolor: "red",
                sdsdcolor: "red",
                sddcolor: "green",
                sdgcolor: "greenopen",
                sdsuducount: 1,
                sdfzcolor: "orange",
                sdzdcolor: "orange",
                sdddcolor: "orange",
            })
        }

        //正转打开，关闭反转，关闭自动，关闭抖动,速度高档
        if (that.data.sdzzcolor == "red") {
            //如果热疗开启
            if (that.data.sdrlcolor == "red") {
                hex = that.replacePos(hex, 6, "9");
            } else {
                hex = that.replacePos(hex, 6, "8");
            }
            hex = that.replacePos(hex, 7, "2");

            //正转关闭，关闭速度
        } else {
            //如果热疗开启
            if (that.data.sdrlcolor == "red") {
                hex = that.replacePos(hex, 6, "1");
            } else {
                hex = that.replacePos(hex, 6, "0");
            }
            hex = that.replacePos(hex, 7, "0");
        }


        that.setData({
            shuidianhex: hex
        })
    },
    //睡垫反转
    shuidianfz: function () {
        console.log("睡垫反转");
        var that = this;
        let hex = that.data.shuidianhex;

        //如果反转打开
        if (that.data.sdfzcolor == "red") {
            that.setData({
                sdfzcolor: "orange",
                sdsdcolor: "orange",
                sdsuducount: 0,
                sddcolor: "green",
                sdzcolor: "green",
                sdgcolor: "green"
            })

            //如果反转关闭  
        } else {
            that.setData({
                sdfzcolor: "red",
                sdsdcolor: "red",
                sddcolor: "green",
                sdgcolor: "greenopen",
                sdsuducount: 1,
                sdzzcolor: "orange",
                sdzdcolor: "orange",
                sdddcolor: "orange"
            })
        }

        //反转打开，关闭正转，关闭自动，关闭抖动,速度低档
        if (that.data.sdfzcolor == "red") {
            //如果热疗开启
            if (that.data.sdrlcolor == "red") {
                hex = that.replacePos(hex, 6, "9");
            } else {
                hex = that.replacePos(hex, 6, "8");
            }
            hex = that.replacePos(hex, 7, "4");

            //反转关闭，关闭速度
        } else {
            //如果热疗开启
            if (that.data.sdrlcolor == "red") {
                hex = that.replacePos(hex, 6, "1");
            } else {
                hex = that.replacePos(hex, 6, "0");
            }
            hex = that.replacePos(hex, 7, "0");
        }

        that.setData({
            shuidianhex: hex
        })
    },
    //睡垫自动
    shuidianzd: function () {
        console.log("睡垫自动");
        var that = this;
        let hex = that.data.shuidianhex;

        //如果自动打开
        if (that.data.sdzdcolor == "red") {
            that.setData({
                sdzdcolor: "orange",
                sdsdcolor: "orange",
                sdsuducount: 0,
                sddcolor: "green",
                sdzcolor: "green",
                sdgcolor: "green"
            })

            //如果自动关闭
        } else {
            that.setData({
                sdzdcolor: "red",
                sdsdcolor: "red",
                sddcolor: "green",
                sdgcolor: "greenopen",
                sdsuducount: 1,
                sdzzcolor: "orange",
                sdfzcolor: "orange",
                sdddcolor: "orange"
            })
        }

        //自动打开，关闭正转，关闭反转，关闭抖动,速度低档
        if (that.data.sdzdcolor == "red") {
            //如果热疗开启
            if (that.data.sdrlcolor == "red") {
                hex = that.replacePos(hex, 6, "9");
            } else {
                hex = that.replacePos(hex, 6, "8");
            }
            hex = that.replacePos(hex, 7, "8");

            //自动关闭，关闭速度
        } else {
            //如果热疗开启
            if (that.data.sdrlcolor == "red") {
                hex = that.replacePos(hex, 6, "1");
            } else {
                hex = that.replacePos(hex, 6, "0");
            }
            hex = that.replacePos(hex, 7, "0");
        }

        that.setData({
            shuidianhex: hex
        })
    },
    //睡垫抖动
    shuidiandd: function () {
        console.log("睡垫抖动");
        var that = this;
        let hex = that.data.shuidianhex;

        //如果抖动打开
        if (that.data.sdddcolor == "red") {
            that.setData({
                sdddcolor: "orange",
                sdsdcolor: "orange",
                sdsuducount: 0,
                sddcolor: "green",
                sdzcolor: "green",
                sdgcolor: "green"
            })

            //如果抖动关闭
        } else {
            that.setData({
                sdddcolor: "red",
                sdsdcolor: "red",
                sddcolor: "green",
                sdgcolor: "greenopen",
                sdsuducount: 1,
                sdzzcolor: "orange",
                sdfzcolor: "orange",
                sdzdcolor: "orange"
            })
        }

        //抖动打开，关闭正转，关闭反转，关闭自动,速度低档
        if (that.data.sdddcolor == "red") {
            //如果热疗开启
            if (that.data.sdrlcolor == "red") {
                hex = that.replacePos(hex, 6, "9");
            } else {
                hex = that.replacePos(hex, 6, "8");
            }
            hex = that.replacePos(hex, 7, "1");

            //抖动关闭，关闭速度
        } else {
            //如果热疗开启
            if (that.data.sdrlcolor == "red") {
                hex = that.replacePos(hex, 6, "1");
            } else {
                hex = that.replacePos(hex, 6, "0");
            }
            hex = that.replacePos(hex, 7, "0");
        }

        that.setData({
            shuidianhex: hex
        })
    },
    //睡垫速度
    shuidiansd: function () {
        console.log("睡垫速度");
        var that = this;
        let hex = that.data.shuidianhex;
        let sudu = that.data.sdsuducount;

        // //第一次点击打开低速
        // if (sudu == 0) {
        //     that.setData({
        //         sdsuducount: 1,
        //         sddcolor: "greenopen",
        //         sdzcolor: "green",
        //         sdsdcolor: "red",
        //         sdgcolor: "green"
        //     })
        //     //第二次点击打开中速
        // }
        //  else if (sudu == 1) {
        //     that.setData({
        //         sdsuducount: 2,
        //         sddcolor: "green",
        //         sdzcolor: "greenopen",
        //         sdgcolor: "green"
        //     })
        //     //第三次点击打开高速
        // } 
        // else if (sudu == 2) {
        //     that.setData({
        //         sdsuducount: 0,
        //         sddcolor: "green",
        //         sdzcolor: "green",
        //         sdgcolor: "greenopen"
        //     })
        // }

        //第一次点击打开低速
        if (sudu == 0) {
            that.setData({
                sdsuducount: 1,
                sddcolor: "greenopen",
                sdsdcolor: "red",
                sdgcolor: "green"
            })
            //第二次点击打开高速
        }
        else if (sudu == 1) {
            that.setData({
                sdsuducount: 0,
                sddcolor: "green",
                sdgcolor: "greenopen"
            })
        }

        //如果加热打开
        // if (that.data.sdrlcolor == "red") {
        //     if (sudu == 0) {
        //         hex = that.replacePos(hex, 6, "3");
        //     } else if (sudu == 1) {
        //         hex = that.replacePos(hex, 6, "5");
        //     } else if (sudu == 2) {
        //         hex = that.replacePos(hex, 6, "9");
        //     }
        // } else {
        //     if (sudu == 0) {
        //         hex = that.replacePos(hex, 6, "2");
        //     } else if (sudu == 1) {
        //         hex = that.replacePos(hex, 6, "4");
        //     } else if (sudu == 2) {
        //         hex = that.replacePos(hex, 6, "8");
        //     }
        // }
        if (that.data.sdrlcolor == "red") {
            if (sudu == 0) {
                hex = that.replacePos(hex, 6, "3");
            } else if (sudu == 1) {
                hex = that.replacePos(hex, 6, "9");
            } 
        } else {
            if (sudu == 0) {
                hex = that.replacePos(hex, 6, "2");
            } else if (sudu == 1) {
                hex = that.replacePos(hex, 6, "8");
            }
        }

        that.setData({
            shuidianhex: hex
        })
    },
    //睡垫热疗
    shuidianrl: function () {
        console.log("睡垫热疗");
        var that = this;
        let hex = that.data.shuidianhex;
        let sdrlcolor = that.data.sdrlcolor;
        //如果热疗开启
        if (sdrlcolor == "red") {
            let changet = (parseInt(hex.charAt(6), 16) - 1).toString(16);
            hex = that.replacePos(hex, 6, changet);
            sdrlcolor = "orange";
        } else {
            let changet = (parseInt(hex.charAt(6), 16) + 1).toString(16);
            hex = that.replacePos(hex, 6, changet);
            sdrlcolor = "red";
        }
        that.setData({
            sdrlcolor: sdrlcolor,
            shuidianhex: hex
        })
    },
    //睡垫暂停
    shuidianstop: function () {
        console.log("睡垫暂停");
        var that = this;
        let hex = that.data.shuidianhex;

        //如果暂停开启
        if (that.data.sdztcolor == "red") {
            that.setData({
                sdztcolor: "orange"
            })
            that.shuidianzd();
            that.shuidianrl();
            //如果暂停关闭
        } else {
            that.setData({
                sdddcolor: "orange",
                sdsdcolor: "orange",
                sddcolor: "green",
                sdzcolor: "green",
                sdgcolor: "green",
                sdsuducount: 0,
                sdzzcolor: "orange",
                sdfzcolor: "orange",
                sdztcolor: "red",
                sdzdcolor: "orange",
                sdrlcolor: "orange"
            })
        }

        //打开暂停
        if (that.data.sdztcolor == "red") {
            that.setData({
                shuidianhex: "AA55040000000000000009C33C"
            })
        }
    },
//-------------靠垫JH-C12控制板部分--------------
//控制程序入口
    c12control: function (e) {
        let id = e.currentTarget.id;
        var that = this;
        if (!that.data.cdflag) {
            console.log("按键冷却中");

            return;
        } else {
            that.setData({
                cdflag: false
            })
            setTimeout(function () {
                that.setData({
                    cdflag: true
                })
            }, 600)
        }

        //颈部慢速
        if (id == "jbms") {
            //判断开关是否打开
            if (that.data.c12ztcolor == "red") {
                console.log("开关未开启");
                return;
            }
            that.c12jbms();

            //颈部手动
        } else if (id == "jbsd") {
            //判断开关是否打开
            if (that.data.c12ztcolor == "red") {
                console.log("开关未开启");
                return;
            }
            that.c12jbsd();

            //颈部自动
        } else if (id == "jbzd") {
            //判断开关是否打开
            if (that.data.c12ztcolor == "red") {
                console.log("开关未开启");
                return;
            }
            that.c12jbzd();

            //背部慢速
        } else if (id == "bbms") {
            //判断开关是否打开
            if (that.data.c12ztcolor == "red") {
                console.log("开关未开启");
                return;
            }
            //判断背部摇摆和揉捏是否都关闭
            if (that.data.c12ybcolor == "orange" && that.data.c12rncolor=="orange"){
                return;
            }
            that.c12bbms();

            //背部摇摆
        } else if (id == "bbyb") {
            //判断开关是否打开
            if (that.data.c12ztcolor == "red") {
                console.log("开关未开启");
                return;
            }
            that.c12bbyb();

            //背部揉捏
        } else if (id == "bbrn") {
            //判断开关是否打开
            if (that.data.c12ztcolor == "red") {
                console.log("开关未开启");
                return;
            }
            that.c12bbrn();

            //振动
        } else if (id == "c12zd") {
            //判断开关是否打开
            if (that.data.c12ztcolor == "red") {
                console.log("开关未开启");
                return;
            }
            that.c12zd();

            //热疗
        } else if (id == "c12rl") {
            //判断开关是否打开
            if (that.data.c12ztcolor == "red") {
                console.log("开关未开启");
                return;
            }
            that.c12rl();

            //暂停
        } else if (id == "c12zt") {
            that.c12zt();
        }

        that.step8();
    },
    //c12颈部手动
    c12jbsd:function(){
        var that=this;
        let hex=that.data.c12hex;
        let c12sdcount = that.data.c12sdcount;

        //点击一次打开手动正传,关闭颈部自动
        if(c12sdcount==0){
            that.setData({
                c12jbmscolor: "orange",
                c12jbsdcolor: "red",
                c12jbzdcolor: "orange",
                c12sdcount:1
            })
            //如果颈部慢速打开，关闭颈部慢速
            if (that.data.c12jbmscolor=="red"){
                hex = that.replacePos(hex, 16, "0");
            }
            hex = that.replacePos(hex, 15, "2");
        //点击二次打开手动反转，关闭颈部自动，关闭颈部慢速
        }else if(c12sdcount==1){
            //如果颈部慢速打开，关闭颈部慢速
            if (that.data.c12jbmscolor == "red") {
                hex = that.replacePos(hex, 16, "0");
            }
            that.setData({
                c12jbmscolor: "orange",
                c12jbsdcolor: "red",
                c12jbzdcolor: "orange",
                c12sdcount: 2
            })
           
            hex = that.replacePos(hex, 15, "4");
        //点击三次关闭颈部手动
        }else if(c12sdcount==2){
            that.setData({
                c12jbsdcolor: "orange",
                c12sdcount: 0
            })
            hex = that.replacePos(hex, 15, "0");
        }
        that.setData({
            c12hex: hex
        })
    },  
    //C12颈部自动
    c12jbzd:function(){
        var that = this;
        let hex = that.data.c12hex;
        
        //如果颈部自动打开
        if (that.data.c12jbzdcolor=="red"){
            that.setData({
                c12jbzdcolor: "orange"
            })
            hex = that.replacePos(hex, 15, "0");
        }else{
            //如果颈部慢速打开，关闭颈部慢速
            if (that.data.c12jbmscolor == "red") {
                hex = that.replacePos(hex, 16, "0");
            }
            that.setData({
                c12jbmscolor: "orange",
                c12jbsdcolor: "orange",
                c12jbzdcolor: "red",
                c12sdcount: 0
            })
            hex = that.replacePos(hex, 15, "1");
        }

        that.setData({
            c12hex: hex
        })
    },
   //C12颈部慢速
    c12jbms:function(){
        var that = this;
        let hex = that.data.c12hex;

        //如果颈部慢速打开
        if (that.data.c12jbmscolor=="red"){
            that.setData({
                c12jbmscolor: "orange",
            })
            hex = that.replacePos(hex, 16, "0");
        }else{
            that.setData({
                c12jbmscolor: "red",
                c12jbsdcolor: "red",
                c12jbzdcolor: "orange",
                c12mscolor: "orange",
                c12sdcount: 1
            })
            hex = that.replacePos(hex, 16, "2");
            hex = that.replacePos(hex, 15, "2");
        }  

        that.setData({
            c12hex: hex
        })    
    },
    //c12背部慢速   
    c12bbms:function(){
        var that = this;
        let hex = that.data.c12hex;

        //如果背部慢速打开
        if (that.data.c12mscolor=="red"){
            that.setData({
                c12mscolor: "orange"
            })
            hex = that.replacePos(hex, 16, "0");
        }else{
            that.setData({
                c12mscolor: "red",
                c12jbmscolor:"orange"
            })
            hex = that.replacePos(hex, 16, "1");
        }

        that.setData({
            c12hex: hex
        })    
    },
    //c12背部摇摆
    c12bbyb:function(){
        var that = this;
        let hex = that.data.c12hex;

        //如果背部摇摆打开
        if (that.data.c12ybcolor=="red"){
            //如果背部慢速打开
            if (that.data.c12mscolor=="red"){
                hex = that.replacePos(hex, 16, "0");
            }
            that.setData({
                c12mscolor: "orange",
                c12ybcolor: "orange"
            })
            
            hex = that.replacePos(hex, 14, "0");
        }else{
            //如果背部慢速打开
            if (that.data.c12mscolor == "red") {
                hex = that.replacePos(hex, 16, "0");
            }
            that.setData({
                c12mscolor: "orange",
                c12ybcolor: "red",
                c12rncolor: "orange"
            })
            hex = that.replacePos(hex, 14, "1");
            hex = that.replacePos(hex, 6, "0");
        }

        that.setData({
            c12hex: hex
        })   
    },
    //c12背部揉捏
    c12bbrn:function(){
        var that = this;
        let hex = that.data.c12hex;

        //如果背部揉捏打开
        if (that.data.c12rncolor == "red") {
            //如果背部慢速打开
            if (that.data.c12mscolor == "red") {
                hex = that.replacePos(hex, 16, "0");
            }
            that.setData({
                c12mscolor: "orange",
                c12rncolor: "orange"
            })

            hex = that.replacePos(hex, 6, "0");
        } else {
            //如果背部慢速打开
            if (that.data.c12mscolor == "red") {
                hex = that.replacePos(hex, 16, "0");
            }
            that.setData({
                c12mscolor: "orange",
                c12ybcolor: "orange",
                c12rncolor: "red"
            })
            hex = that.replacePos(hex, 6, "8");
            hex = that.replacePos(hex, 14, "0");
        }

        that.setData({
            c12hex: hex
        }) 
    },
    //c12振动
    c12zd:function(){
        var that = this;
        let hex = that.data.c12hex;
        let c12zdcount = that.data.c12zdcount;

        //振动第一次按下,打开振动低
        if(c12zdcount==0){
            that.setData({
                c12zdcount: 1,
                c12zdcolor:"red",
                c12dcolor: "greenopen",
                c12zcolor: "green",
                c12gcolor: "green",
            }) 
            hex = that.replacePos(hex, 11, "1");
        //振动第二次按下，打开振动中
        }else if(c12zdcount==1){
            that.setData({
                c12zdcount: 2,
                c12dcolor: "green",
                c12zcolor: "greenopen",
                c12gcolor: "green",
            })
            hex = that.replacePos(hex, 11, "2");
        //振动第三次按下，打开振动高
        }else if(c12zdcount==2){
            that.setData({
                c12zdcount: 3,
                c12dcolor: "green",
                c12zcolor: "green",
                c12gcolor: "greenopen",
            })
            hex = that.replacePos(hex, 11, "4");
        //振动第四次按下,关闭振动
        }else if(c12zdcount==3) {
            that.setData({
                c12zdcount: 0,
                c12zdcolor: "orange",
                c12dcolor: "green",
                c12zcolor: "green",
                c12gcolor: "green",
            })
            hex = that.replacePos(hex, 11, "0");
        }

        that.setData({
            c12hex: hex
        }) 
    },
    //c12热疗
    c12rl:function(){
        var that = this;
        let hex = that.data.c12hex;

        //如果热疗打开
        if (that.data.c12rlcolor=="red"){
            that.setData({
                c12rlcolor: "orange"
            })
            hex = that.replacePos(hex, 10, "0");
        }else{
            that.setData({
                c12rlcolor: "red"
            })
            hex = that.replacePos(hex, 10, "8");
        }
        that.setData({
            c12hex: hex
        }) 
    },
    //c12暂停
    c12zt:function(){
        var that = this;
        //如果暂停打开
        if (that.data.c12ztcolor=="red"){
            that.setData({
                c12ztcolor: "orange"
            })
            that.c12jbzd();
            that.c12bbrn();
            that.c12rl();
            that.c12zd();
            that.c12zd();
            that.c12zd();
        }else{
            that.setData({
                c12jbmscolor: "orange",
                c12jbsdcolor: "orange",
                c12jbzdcolor: "orange",
                c12mscolor: "orange",
                c12ybcolor: "orange",
                c12rncolor: "orange",
                c12zdcolor: "orange",
                c12rlcolor: "orange",
                c12ztcolor: "red",
                c12dcolor: "green",
                c12zcolor: "green",
                c12gcolor: "green",
                c12sdcount: 0,
                c12zdcount: 0,
                c12hex: "AA55040100000000000009C33C"
            })
        }
    }
})
