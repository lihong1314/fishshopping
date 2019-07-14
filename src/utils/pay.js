import * as tradeService from '../services/trade_n'
const promisify = require('./promisify')
const { getStorage, setStorage } = require('./storage');
function gopay() {
  const { uid: memberId } = getStorage('USER_INFO') || {};
  tradeService
  .getCart( memberId )
  .then( tradeService.buildCartData )
  .then( tradeService.buildInnercartData )
  .then( tradeService.cartOrder )
  .then( tradeService.pay )
  .then( pay => {
      const goPay = promisify( wx.requestPayment );
      goPay( JSON.parse( pay.url ) )
      .then( res => {
        wx.redirectTo({
          url: "/pages/paysuccess_n/paysuccess_n",
        })
      })
      .catch(()=>{
        wx.navigateTo({
          url: '/pages/orderlist_n/orderlist_n?type=2'
        })
      })
  })
  .catch( err => wx.showModal({title: JSON.stringify( err ) }))
}
module.exports = {
  gopay
}

