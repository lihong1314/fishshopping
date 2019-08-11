require('./stordetail.less');

const { getStorage, setStorage } = require('../../utils/storage');
import '../../components/tip/tip.less';
import '../../components/disable/tip.less';
import * as storeService from '../../services/store';
import * as wxp from '../../services/wxp';
const account = require('../../services/account.js');
Page({
  data:{
    imgArr:[],
    imgSrc:'',
    maxFlg:false,
    isShowMod:false,
    disableFlag:false
  },
  onShow(){
    
    
  },
  initLocation() {
    wxp
      .getLocation()
      .then((res) =>{
        // console.log('res:',res)
        setStorage('location',{latitude:res.latitude.toFixed(4),longitude:res.longitude.toFixed(4)})
        this.setData({
          location:{latitude:res.latitude.toFixed(4),longitude:res.longitude.toFixed(4)}
        })
      })
      
  },
  onLoad(option){
    this.initLocation();
    const {shopid} = option;
    this.setData({
      shopid
    })
    const { access,cuserId } = getStorage( 'USER_INFO' ) || {};
    if(!cuserId){
      this.getData()
    }else{
      if(access == "Y" && access){
       
        this.getData()
      }else{
        this.setData({
          disableFlag:true
        })
      }
    }
   
      
   
  },
  getData(){
    const {shopid} = this.data;
    wx.showLoading({title:'加载中...'})
    storeService
      .getStoreDetail({
        shopId:shopid
      })
      .then(res => {
        wx.hideLoading();
        this.setData({
          shopid,
          attention:res.attention,
          attentionedNum:res.attentionedNum,
          closingTime:res.closingTime,
          openingTime:res.openingTime,
          distance:res.distance,
          imgArr:res.images,
          shopAdress:res.shopAdress,
          shopDetailAdress:res.shopDetailAdress,
          shopIcon:res.shopIcon,
          shopName:res.shopName,
          shopTel:res.shopTel,
          shopLatitude:res.shopLatitude,
          shopLongitude:res.shopLongitude
        })


        
        
      })
  },
  maxFn(e){
    var index = e.currentTarget.dataset.index;//获取data-src
    var imgList = e.currentTarget.dataset.list;//获取data-list
    //图片预览
    wx.previewImage({
      current: imgList[index], // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  closeFn(){
    this.setData({
      maxFlg:false
    })
  },
  shareFn(){

  },
  onShareAppMessage(option) {
    let that = this;
    console.log("that.data.shopName:",that.data.shopName)
    return {
      title: that.data.shopName,
      imageUrl:'',
      path: `/pages/stordetail/stordetail?shopid=${this.data.shopid}`,//小程序的跳转路径
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

  focusFn(){
    storeService
      .attentionFn({
        shopId:this.data.shopid,
        attention:!this.data.attention
      })
      .then(res=>{
        this.setData({
          attention:res.attention
        })
      })
    
  },
  callFn(){
    wx.makePhoneCall({
      phoneNumber: this.data.shopTel,
    })
  },
  openAddressFn(){
    wx.openLocation({
      latitude: this.data.shopLatitude,
      longitude: this.data.shopLongitude,
      scale: 18,
      name: '',
      address: this.data.shopDetailAdress
    })
  },
  onGotUserInfo(e){
    const { cuserId,access } = getStorage( 'USER_INFO' ) || {};
    if(cuserId){
      this.focusFn()
    }else{
      console.log('允许')
      wx.showLoading({
        title: '授权中请稍后...',
        mask: true
      })
      console.log('e:',e)
      if(e.detail.errMsg == "getUserInfo:fail auth deny"){
        wx.hideLoading();
        return
      }
      return account.bindAccountBySilent(e.detail).then(res => {
        setStorage( 'USER_INFO', res );
        this.setData({
          islogin:true
        })
        this.getData()
        const pages = getCurrentPages()
        const perpage = pages[pages.length - 1]
        perpage.onLoad()  
      }, err => {
        // wx.redirectTo({ url: '/pages/personal/personal'})
      })
    }
  }
})