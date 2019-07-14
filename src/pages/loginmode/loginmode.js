const account = require('../../services/account.js');
require('./loginmode.less');
const { getStorage, setStorage } = require('../../utils/storage');
Page({
  data: {},
  
  /**
   * 静默绑定非凡帐号
   * @param params
   * @return {*|Promise<any>|Promise.<TResult>|Thenable<any>}
   */
   onGotUserInfo: function (e) {
    console.log('允许')
    wx.showLoading({
      title: '授权中请稍后...',
      mask: true
    })
    console.log('e:',e)
    return account.bindAccountBySilent(e.detail).then(res => {
      setStorage( 'USER_INFO', res );
      wx.switchTab({
        url: '/pages/personal/personal'
      })
    }, err => {
      wx.redirectTo({ url: '/pages/personal/personal'})
    })
  },

  phoneLoginTap() {
    wx.redirectTo({
      url: '/pages/login/login'
    })
  }

})
