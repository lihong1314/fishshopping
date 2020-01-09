require('./fansDetail.less');

const { getStorage, setStorage } = require('../../utils/storage');
import '../../components/tip/tip.less';
import * as personalService from '../../services/personal';
import * as indexService from '../../services/index';
const account = require('../../services/account.js');
Page({
  data: {
    isShowMod: false,
    offset: 1,
    limit: 10,
    total: 0,
    list: [],
    attention: true
  },
  onShow() {


  },
  onLoad(option) {

    console.log("scene:", option.scene)
    if (option.scene) {
      let scene = decodeURIComponent(option.scene)
      this.setData({
        fansid: scene
      })
    } else {
      const { fansid } = option;
      this.setData({
        fansid
      })
    }

    if (this.data.fansid) {
      const { latitude, longitude } = getStorage('location') || {};
      personalService
        .getmine2({ cuserId: this.data.fansid, latitude, longitude })
        .then(res => {
          this.setData({
            attentionCNum: res.attentionCNum,
            attentionShopNum: res.attentionShopNum,
            fansNum: res.fansNum,
            publishNum: res.publishNum,
            cUserIcon: res.cUserIcon,
            cUserName: res.cUserName,
            ...res
          })
        })
      this.getList()
    }



  },
  maxFn(e) {
    const { num } = e.currentTarget.dataset;
    console.log(num)
    this.setData({
      imgSrc: this.data.imgArr[num],
      maxFlg: true
    })
  },
  closeFn() {
    this.setData({
      maxFlg: false
    })
  },
  shareFn() {

  },
  onShareAppMessage(option) {
    this.toShare();
    //在此处获取option中取到的title和img等属性值
    return {
      title: title,
      imageUrl: imageUrl,
      path: 'pages',//小程序的跳转路径
      success: function (res) {
        console.log(res)
        // 转发成功
      },
      fail: function (res) {
        console.log(res)
        // 转发失败
      }
    }
  },
  cancelFn() {
    this.setData({
      isShowMod: false
    })
  },
  sureFn() {
    this.setData({
      isShowMod: false
    })
    const { cuserId } = getStorage('USER_INFO') || {};
    personalService
      .addOrCancleAttention({
        cuserId,
        attentionId: this.data.fansid,
        attention: !this.data.attention
      })
      .then(res => {
        this.setData({
          attention: res.attention
        })
      })
  },
  cancelFocus() {
    this.setData({
      isShowMod: true
    })
  },
  onReachBottom: function () {
    if (this.data.total > this.data.limit * (this.data.offset)) {
      this.setData({
        offset: this.data.offset + 1,
      });
      console.log("上拉加载:", this.data.offset)
      this.getList()
    }
  },

  onPullDownRefresh() {
    this.setData({
      list: [],
      offset: 1,
      total: 0,
    })
    console.log("下拉刷新:", this.data.offset)
    this.getList();
  },
  getList() {
    wx.showLoading({ title: '加载中...' })
    personalService
      .attentionDetailList({
        attentionId: this.data.fansid,
        page: this.data.offset,
        size: this.data.limit
      })
      .then(res => {
        wx.hideLoading()
        if (!res.publishList) {
          this.setData({
            list: null,
            total: res.totalSize,
            attention: res.attention
          })
        } else {
          this.setData({
            list: this.data.list.concat(res.publishList),
            total: res.totalSize,
            attention: res.attention
          })
        }

        wx.stopPullDownRefresh();

      })
  },
  gotoPostFn(e) {
    const { publishid } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/post/post?id=${publishid}`
    })
  },
  collectionFn(e) {
    const { publishid, index, collection } = e.currentTarget.dataset;//当前所在页面的 index

    indexService
      .chenkCollection({
        publishId: publishid,
        collection: !collection
      })
      .then(res => {
        let list = this.data.list;

        list[index].collection = res.collection
        this.setData({
          list
        })

      })

  },
  focusFn() {
    const { cuserId } = getStorage('USER_INFO') || {};
    if (cuserId == this.data.fansid) {
      return;
    }
    personalService
      .addOrCancleAttention({
        cuserId,
        attentionId: this.data.fansid,
        attention: !this.data.attention
      })
      .then(res => {
        this.setData({
          attention: res.attention
        })
      })
  },
  gotofans(e) {
    wx.navigateTo({
      url: `/pages/fans/fans?id=${this.data.fansid}&type=1&uname=${this.data.cUserName}`
    })
  },
  gotostar() {
    wx.navigateTo({
      url: `/pages/star/star?id=${this.data.fansid}&type=1&uname=${this.data.cUserName}`
    })
  },
  gotoColl() {
    wx.navigateTo({
      url: `/pages/tacollection/tacollection?id=${this.data.fansid}&uname=${this.data.cUserName}`
    })
  },
  onGotUserInfo: function (e) {
    const { type } = e.currentTarget.dataset;
    const { cuserId, access } = getStorage('USER_INFO') || {};
    if (cuserId) {
      console.log("type:", type)
      if (type == "2") {
        this.cancelFocus()
      } else if (type == '1') {
        this.focusFn()
      } else if (type == '3') {
        this.collectionFn(e)
      } else if (type == '4') {
        this.gotofans(e)
      } else if (type == '5') {
        this.gotostar(e)
      } else if (type == '6') {
        this.gotoColl(e)
      }

    } else {
      console.log('允许')
      wx.showLoading({
        title: '授权中请稍后...',
        mask: true
      })
      console.log('e:', e)
      if (e.detail.errMsg == "getUserInfo:fail auth deny") {
        wx.hideLoading();

        return
      }
      return account.bindAccountBySilent(e.detail).then(res => {
        setStorage('USER_INFO', res);
        this.setData({
          islogin: true
        })
        this.getList()
        const pages = getCurrentPages()
        const perpage = pages[pages.length - 1]
        perpage.onLoad()
      }, err => {
        // wx.redirectTo({ url: '/pages/personal/personal'})
      })
    }

  },
  inStorFn(e) {
    const { shopid } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/stordetail/stordetail?shopid=${shopid}`
    })
  },
  chooselaction() {

    wx.openLocation({
      latitude: this.data.shopLatitude,
      longitude: this.data.shopLongitude,
      scale: 18,
      name: '',
      address: this.data.shopDetailAddress
    })
  },
})