require('./post.less');

import '../../components/tip/tip.less';
import * as indexService from '../../services/index'; 
var util = require('../../utils/index.js');
import * as personalService from '../../services/personal'; 
const { getStorage, setStorage } = require('../../utils/storage');

Page({
    data:{
      imgUrls: [],
      indicatorDots: true,
      autoplay: false,
      interval: 5000,
      duration: 1000,
      current:0,
      isShowMod:false,
      collectionImg:'/assets/images/collection.png',
      collectionCon:'收藏',
      con:''
    },
    onLoad(option){
      const {id} = option;
      this.setData({
        publishId:id
      })
      wx.showLoading({title:'加载中...'})
      indexService
      .getRecommendDetail({
        publishId:id
      })
      .then(res => {
        if(res){
          let createTime = util.formatTimeM(res.createTime);
          this.setData({
            imgUrls:res.images,
            content:res.content,
            createTime,
            attention:res.attention,
            cuserIcon:res.cuserIcon,
            cuserId:res.cuserId,
            cuserName:res.cuserName,
            fansNum:res.fansNum,
            location:res.location,
            publishNum:res.publishNum,
            shopAddress:res.shopAddress,
            shopDetailAddress:res.shopDetailAddress,
            shopDitance:res.shopDitance,
            shopIcon:res.shopIcon,
            shopName:res.shopName,
            shopId:res.shopId,
            collection:res.collection,
            shopLongitude:res.shopLongitude,
            shopLatitude:res.shopLatitude,
            readTimes:res.readTimes
          })
        }else{
          this.setData({
            con:'该淘贴已被删除'
          })
        }
        
        wx.hideLoading();
      })
    },
    onShow(){
      
    },
    shareFn(){

    },
    onShareAppMessage(option) {
      let that = this;
      // this.toShare();
      //在此处获取option中取到的title和img等属性值
      return {
          title: that.data.content,
          imageUrl: that.data.imgUrls[0],
          path: `/pages/post/post?id=${that.data.publishId}`,//小程序的跳转路径
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
    chooselaction(){

      wx.openLocation({
        latitude: this.data.shopLatitude,
        longitude: this.data.shopLongitude,
        scale: 18,
        name: '',
        address: this.data.shopDetailAddress
      })
    },
    jubaoFn(){
      
      wx.navigateTo({
        url: `/pages/report/report?publishid=${this.data.publishId}`
      })
    },
    cancelFn(){
      this.setData({
        isShowMod:false
      })
    },
    sureFn(){
      const { cuserId } = getStorage( 'USER_INFO' ) || {};
      personalService
      .addOrCancleAttention({
        cuserId,
        attentionId:this.data.cuserId,
        attention:!this.data.attention
      })
      .then(res=>{
        this.setData({
          isShowMod:false,
          attention:res.attention
        })
      })
      
    },
    cancelFocus(){
      const { cuserId } = getStorage( 'USER_INFO' ) || {};
      if(cuserId == this.data.cuserId){
        return;
      }
      this.setData({
        isShowMod:true
      })
    },
    focusFn(){
      const { cuserId } = getStorage( 'USER_INFO' ) || {};
      if(cuserId == this.data.cuserId){
        return;
      }
      personalService
      .addOrCancleAttention({
        cuserId,
        attentionId:this.data.cuserId,
        attention:!this.data.attention
      })
      .then(res=>{
        this.setData({
          attention:res.attention
        })
      })
    },
    checkCollentFn(){
      indexService
      .chenkCollection({
        publishId:this.data.publishId,
        collection:!this.data.collection
      })
      .then(res => {
        this.setData({
          collection:res.collection
        })

      })
      
    },
    gotoFansDetailFn(e){
      const {fansid} =  e.currentTarget.dataset;
      wx.navigateTo({
        url:`/pages/fansDetail/fansDetail?fansid=${fansid}`
      })
    },
    inStorFn(e){
      const {shopid} = e.currentTarget.dataset;
      wx.navigateTo({
        url:`/pages/stordetail/stordetail?shopid=${shopid}`
      })
    }

  })