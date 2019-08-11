require('./post.less');

import '../../components/tip/tip.less';
import '../../components/disable/tip.less';
import * as indexService from '../../services/index'; 
var util = require('../../utils/index.js');
import * as personalService from '../../services/personal'; 
const { getStorage, setStorage } = require('../../utils/storage');
import * as wxp from '../../services/wxp';
const account = require('../../services/account.js');

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
      con:'',
      disableFlag:false
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
      var that = this;
      that.initLocation();
      const {id} = option;
      that.setData({
        publishId:id
      })
      const { cuserId,access } = getStorage( 'USER_INFO' ) || {};
     
      // console.log(refresh);
      if(!cuserId){
        console.log('wq go')
        that.getdata()
      }else{
        if(access == "Y" && access){
          wx.showLoading({title:'加载中...'})
          that.getdata()
        }else{
          that.setData({
            disableFlag:true
          })
        }
      }
      
     
    },
    getdata(){
      indexService
        .getRecommendDetail({
          publishId:this.data.publishId
        })
        .then(res => {
          if(res){
            wx.hideLoading();
            let createTime = util.formatTimeM(res.createTime);
            this.setData({
              imgUrls:res.images,
              content:res.content.split('&hc').join('\n'),
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

      console.log('ok')
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
        // this.setData({
        //   attention:res.attention
        // })
        this.getdata()
      })
    },
    checkCollentFn(){
      console.log('收藏')
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
    },
    swiperChange: function (e) {
      var that = this;
      if (e.detail.source == 'touch') {
        that.setData({
          current: e.detail.current
        })
      }
    },
    onGotUserInfo: function (e) {
      const {type} =  e.currentTarget.dataset;
      const { cuserId,access } = getStorage( 'USER_INFO' ) || {};
      if(cuserId){
        console.log("type:",type)
        if(type == "2"){
          this.cancelFocus()
        }else if(type == '1'){
          this.focusFn()
        }else if(type == '3'){
          
          this.checkCollentFn()
        }
        
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
          this.getdata()
          const pages = getCurrentPages()
          const perpage = pages[pages.length - 1]
          perpage.onLoad()  
        }, err => {
          // wx.redirectTo({ url: '/pages/personal/personal'})
        })
      }
      
    }

  })