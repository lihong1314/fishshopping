// import * as wxp from './services/wxp'
// import * as locationService from './services/location'
// require('./utils/sensorsdata.js');
import wxValidate from './utils/wxValidate'
import './app.less'
App({
  globalData:{
    goodsId:''
  },
  wxValidate: (rules, messages) => new wxValidate(rules, messages),
  getCurrentCity() {
    return this.globalData.currentCity
  },
  setCurrentCity(currentCity) {
    this.globalData.currentCity = currentCity
  },
  onLaunch: function () {
    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.globalData.navHeight = res.statusBarHeight + 46;
      }, fail(err) {
        console.log(err);
      }
    })
  }
})
