
require('./qrCode.less');
const { getStorage, setStorage } = require('../../utils/storage');
import * as personalService from '../../services/personal';

Page({
  data: {
    qrcodeURL: '',
    cuserName: '',
    tip: '',
    logoURL: "/assets/images/logo.jpg",
    userSrc: "",
    btnY:""
  },
  onLoad() {
    let that = this;
    //获取屏幕尺寸
    wx.getSystemInfo({
      success: function (res) {
        // 高度,宽度 单位为px
        that.setData({
          windowHeight: 912 / 750 * res.windowWidth,
          windowH:res.windowHeight,
          windowWidth: res.windowWidth,
          btnY:res.windowHeight/2+100
        })
      }
    })

    this.getCodeFN();


  },
  getCodeFN() {
    let that = this;
    
    personalService
      .getQrCodeFn()
      .then(res => {
        console.log("token:",res)
        // 生成页面的二维码
        const { cuserId,nickName, avatarUrl } = getStorage('USER_INFO') || {}
        wx.request({
          url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + res,
          data: {
            scene: '000',
            // page: `pages/fansDetail/fansDetail?fansid=${cuserId}`  //这里按照需求设置值和参数,上线用   
            page: `pages/fansDetail/fansDetail`  //这里按照需求设置值和参数   ，测试用
          },
          method: "POST",
          responseType: 'arraybuffer',  //设置响应类型
          success(res) {
            var fsm = wx.getFileSystemManager();

            var buffer = res.data //图片二进制（base64）
            const fileName = wx.env.USER_DATA_PATH + '/app.png';//将二进制转换为src，然后再在cavas中绘制，因为cavas只能识别src,不识别BASE64
            fsm.writeFileSync( fileName, buffer, 'binary') 
            that.setData({
              qrcodeURL:fileName,
              cuserName: nickName,
              tip: "扫码关注" + nickName + "的【小鱼淘街】主页",
              userSrc: avatarUrl
            })
            let _this = that;
            _this.initCanvas(that.data.windowWidth);

          },
          fail(e) {
            console.log(e)
          }
        })
      })
  },
  /**
     * 长按保存图片
     */
  handleLongPress() {
    let _this = this;

    _this.saveImg()

  },
  saveImg: function () {
    let _this = this;
    const canvasObj = {
      x: 0,
      y: 0,
      width: _this.data.windowWidth*3.6,
      height: _this.data.windowHeight*2.8,
      destWidth: _this.data.windowWidth * 3.6,
      destHeight: _this.data.windowHeight * 2.8,
      canvasId: 'qrcode-canvas',
      fileType: 'png'
    };
    // let imgRes = wxs.wxCanvasToTempFilePath(canvasObj);
    console.log("imgRes:", canvasObj)
    wx.canvasToTempFilePath({
      x: canvasObj.x,
      y: canvasObj.y,
      width: canvasObj.width,
      height: canvasObj.height,
      destWidth: canvasObj.destWidth,
      destHeight: canvasObj.destHeight,
      canvasId: canvasObj.canvasId,
      fileType: canvasObj.fileType ? canvasObj.fileType : 'png',
      success: function (res) {
        _this.erweima(res.tempFilePath)
        // resolve(res);
      },
      fail: function (err) {
        // reject(err);
      }
    })
  },
  initCanvas(variableVal) {
    let _this = this;
    const variableNum = variableVal / 750; // 根据设备宽度算出一个rpx为多少px
    const ctx = wx.createCanvasContext('qrcode-canvas');
    // 清除画布上矩形的内容
    ctx.clearRect(0, 0, 0, 0);

    ctx.setFillStyle("#ffffff");
    ctx.fillRect(0,0,_this.data.windowWidth*2,_this.data.windowHeight*2);//添加一个长度为200px、宽度为为100px的矩形路径到当前路径

    console.log("_this.data.qrcodeURL",_this.data.qrcodeURL)
    // 绘制二维码
    const qrCodeDesc = {
      url: _this.data.qrcodeURL,
      left: 150 * variableNum,
      top: 50 * variableNum,
      width: 450 * variableNum,
      height: 450 * variableNum
    };
    ctx.drawImage(qrCodeDesc.url, qrCodeDesc.left, qrCodeDesc.top, qrCodeDesc.width, qrCodeDesc.height);

    // 绘制文字提示
    const textDesc = {
      text: _this.data.tip,
      fontSize: 36 * variableNum,
      color: '#333333',
      left: 80 * variableNum,
      top: 650 * variableNum
    };
    ctx.setFillStyle(textDesc.color);
    ctx.setFontSize(textDesc.fontSize);
    ctx.fillText(textDesc.text, textDesc.left, textDesc.top);

    // 绘制用户头像圆形
    
    var avatorWidth = 210 * variableNum
      , avatorHeight = 210 * variableNum;
    var avatarurlX = 270 * variableNum;   //绘制的头像在画布上的位置
    var avatarurlY = 169 * variableNum;   //绘制的头像在画布上的位置
    const userDesc = {
      url: _this.data.userSrc,
      left: avatarurlX,
      top:avatarurlY,
      width: avatorWidth,
      height: avatorHeight
    };
    ctx.save();
    ctx.beginPath(); //开始绘制
    ctx.arc(avatorWidth / 2 + avatarurlX, avatorHeight / 2 + avatarurlY, avatorWidth / 2, 0, Math.PI * 2, false);
    ctx.clip();
    ctx.drawImage(userDesc.url, userDesc.left, userDesc.top, userDesc.width, userDesc.height);
    ctx.draw();

  },
  erweima(filePath) {
    // 写入临时文件
    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success: function (res) {
        if (res.errMsg === 'saveImageToPhotosAlbum:ok') {
          wx.showToast({
            duration: 3000,
            icon: 'none',
            title: '保存图片成功！',
            mask: true
          });
        } else {
          wx.showToast({
            duration: 3000,
            icon: 'none',
            title: '保存图片失败，请重试！',
            mask: true
          });
        }
        // resolve(res);
      },
      fail: function (err) {
        // reject(err);
      }
    })
  },

})




