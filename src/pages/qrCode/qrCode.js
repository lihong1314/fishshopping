
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
    wx.showLoading({title:'加载中...'})
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
    const { cuserId,nickName, avatarUrl } = getStorage('USER_INFO') || {}
    that.setData({
      cuserName: nickName,
      tip: "扫码关注" + nickName + "的【小鱼淘街】主页"
    })

    wx.setStorage({ //数据存储下来，当时做这个需求时并没有存储，直接下载的图片去绘制的，但是电脑上可以出来，手机不能。所以就多了这一步，有点坑
      key: "avatarUrl",
      data: avatarUrl,
      success:function(res){
        // 下载图片
        wx.downloadFile({
          url: avatarUrl,
          success: function (res) {
            if(res.statusCode == 200){
              that.setData({
                userSrc: res.tempFilePath  
              })
              that.getCodeFN();
            }
            
          }
        })
      }
    })
   


  },
  getCodeFN() {
    let that = this;
    
    personalService
      .getQrCodeFn()
      .then(res => {
        // 生成页面的二维码
        const { cuserId } = getStorage('USER_INFO') || {}
        wx.request({
          url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + res,
          data: {
            scene: `${cuserId}`,
            // page: `pages/fansDetail/fansDetail?fansid=${cuserId}`  //这里按照需求设置值和参数,上线用   
            page: `pages/fansDetail/fansDetail`  //这里按照需求设置值和参数   ，测试用
          },
          method: "POST",
          responseType: 'arraybuffer',  //设置响应类型
          success(res) {
            wx.hideLoading();
            var fsm = wx.getFileSystemManager();

            var buffer = res.data //图片二进制（base64）
            const fileName = wx.env.USER_DATA_PATH + '/app.png';//将二进制转换为src，然后再在cavas中绘制，因为cavas只能识别src,不识别BASE64
            fsm.writeFileSync( fileName, buffer, 'binary') 
            that.setData({
              qrcodeURL:fileName,
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
     * 点击保存图片
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
      height: (_this.data.windowH/2+50)*3.6,
      destWidth: _this.data.windowWidth * 3.6,
      destHeight: (_this.data.windowH/2+50)*3.6,
      canvasId: 'qrcode-canvas',
      fileType: 'png'
    };
    // console.log("canvasObj:",canvasObj)
    // let imgRes = wxs.wxCanvasToTempFilePath(canvasObj);
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
    // console.log("variableNum:",variableNum)
    const ctx = wx.createCanvasContext('qrcode-canvas');
    // 清除画布上矩形的内容
    ctx.clearRect(0, 0, 0, 0);

    ctx.setFillStyle("#ffffff");
    ctx.fillRect(0,0,_this.data.windowWidth*2,_this.data.windowHeight*2);//添加一个长度为200px、宽度为为100px的矩形路径到当前路径

    // 绘制二维码
    const qrCodeDesc = {
      url: _this.data.qrcodeURL,
      left: 150 * variableNum,
      top: 90 * variableNum,
      width: 450 * variableNum,
      height: 450 * variableNum
    };
    // console.log("qrCodeDesc:",qrCodeDesc)
    ctx.drawImage(qrCodeDesc.url, qrCodeDesc.left, qrCodeDesc.top, qrCodeDesc.width, qrCodeDesc.height);

    // 绘制文字提示
    const textDesc = {
      text: _this.data.tip,
      fontSize: 36 * variableNum,
      color: '#333333',
      left: 86 * variableNum,
      top: 615 * variableNum
    };

    var row = _this.strFn(textDesc,ctx);
    
    for (var b = 0; b < row.length; b++) {
      var nameWidth = ctx.measureText(row[b]).width;
      ctx.fillText(row[b], nameWidth/6, textDesc.top+ b * 30,450);
      
    }
    

    // 绘制用户头像圆形
    
    var avatorWidth = 210 * variableNum
      , avatorHeight = 210 * variableNum;
    var avatarurlX = 270 * variableNum;   //绘制的头像在画布上的位置
    var avatarurlY = 209 * variableNum;   //绘制的头像在画布上的位置
  
    const userDesc = {
      url: _this.data.userSrc,
      left: avatarurlX,
      top:avatarurlY,
      width: avatorWidth,
      height: avatorHeight
    };
    ctx.save();
    ctx.beginPath(); //开始绘制
    ctx.setFillStyle('#fff')
    ctx.arc(avatorWidth / 2 + avatarurlX, avatorHeight / 2 + avatarurlY, avatorWidth / 2, 0, Math.PI * 2, false);
    ctx.fill();
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
  strFn(textDesc,ctx){//处理字符串的换行
    var chr =textDesc.text.split("");//这个方法是将一个字符串分割成字符串数组
    var temp = "";
    var row = [];
    ctx.setFillStyle(textDesc.color);
    ctx.setFontSize(textDesc.fontSize);
    for (var a = 0; a < chr.length; a++) {
      if (ctx.measureText(temp).width < 300) {
        temp += chr[a];
      }
      else {
        a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
        row.push(temp);
        temp = "";
      }
    }
    row.push(temp);
    //如果数组长度大于2 则截取前两个
    if (row.length > 2) {
      var rowCut = row.slice(0, 2);
      var rowPart = rowCut[1];
      var test = "";
      var empty = [];
      for (var a = 0; a < rowPart.length; a++) {
        if (ctx.measureText(test).width < 280) {
          test += rowPart[a];
        }
        else {
          break;
        }
      }
      empty.push(test);
      var group = empty[0] + "..."//这里只显示两行，超出的用...表示
      rowCut.splice(1, 1, group);
      row = rowCut;
    }
    return row
  }

})




