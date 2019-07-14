import * as barcodeService from '../services/barcode_n'
const { checkLogin, message } = require('./index.js');
function scanGoodsCode(fn) {
  barcodeService
    .scanCode()                 //扫描二维码并获取相关信息
    .then( resource => {
      const { scanType, result } = resource || {};   //获取二维码的内容和类型
      switch( scanType ){
        case 'QR_CODE':
          barcodeService
            .getCryptCode(result)          //对二维码进行解密
            .then(barcodeService.decrypt)  //将解密后的信息发送给后台
            .then(barcodeService.parseNavigator)   //对数据进行处理后获取相关的url
            .then(url => {
              // wx.switchTab({
              //   url
              // })
              return fn(url)
            })
            .catch(err => message(err) )
          break;
        case 'CODE_39':
          // wx.navigateTo({
          //   url: `/pages/goodsdetail/goodsdetail?q=${result}&scanType=1`
          // })
          wx.navigateTo({
            url: `/pages/index_n/index_n`
          })

          break;
        default:
      }
    })
}
module.exports = {
  scanGoodsCode
}
