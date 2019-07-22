require('./stordetail.less');

const { getStorage, setStorage } = require('../../utils/storage');
import '../../components/tip/tip.less';
import * as storeService from '../../services/store';

Page({
  data:{
    imgArr:[],
    imgSrc:'',
    maxFlg:false,
    isShowMod:false,
    
  },
  onShow(){
    
    
  },
  onLoad(option){
    const {shopid} = option;
    wx.showLoading({title:'加载中...'})
    storeService
      .getStoreDetail({
        shopId:shopid
      })
      .then(res => {
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


        wx.hideLoading();
        
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
  // cancelFn(){
  //   this.setData({
  //     isShowMod:false
  //   })
  // },
  // sureFn(){
  //   this.setData({
  //     isShowMod:false
  //   })
  //   storeService
  //     .attentionFn({
  //       shopId:this.data.shopid,
  //       attention:!this.data.attention
  //     })
  //     .then(res=>{
  //       this.setData({
  //         attention:res.attention
  //       })
  //     })
  // },
  focusFn(){
    // if(!this.data.attention){
    //   this.setData({
    //     isShowMod:false
    //   })
    //   storeService
    //   .attentionFn({
    //     shopId:this.data.shopid,
    //     attention:!this.data.attention
    //   })
    //   .then(res=>{
    //     this.setData({
    //       attention:res.attention
    //     })
    //   })
      
    // }else{
    //   this.setData({
    //     isShowMod:true
    //   })
    
    // }

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
  }
})