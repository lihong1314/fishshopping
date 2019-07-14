
require('./personal.less');

import '../../components/tip/tip.less';
const { getStorage, setStorage } = require('../../utils/storage');
import * as personalService from '../../services/personal'; 
import * as indexService from '../../services/index'; 

Page({
  data:{
    isShowMod:false,
    collectShow:true,
    postShow:false,
    offset: 1,
    limit: 20,
    total: 0,
    addweight:0
  },
  cancelFn(){
    this.setData({
      isShowMod:false
    })
  },
  sureFn(){
    this.setData({
      isShowMod:false
    })
  },
  cancelFocus(){
    this.setData({
      isShowMod:true
    })
  },
  onShow(){
    console.log('显示')
  const { cuserId } = getStorage( 'USER_INFO' ) || {};
   personalService
   .getmine({cuserId})
   .then(res => {

     this.setData({
      attentionCNum:res.attentionCNum,
      attentionShopNum:res.attentionShopNum,
      fansNum:res.fansNum,
      publishNum:res.publishNum,
      avatarUrl:res.cUserIcon,
      nickName:res.cUserName
     })
   })

   this.getList()
  },
  onLoad(){
   const {avatarUrl,nickName,cuserId} =  getStorage('USER_INFO') || {}
   this.setData({
     cuserId
   })
   
  },
  gotoHelp(){
    wx.navigateTo({
      url: `/pages/help/help`
    })
  },
  collectFn(){
    this.setData({
      collectShow:true,
      postShow:false,
      addweight:0
    })
    this.getList()
  },
  postFn(){
    this.setData({
      postShow:true,
      collectShow:false,
      addweight:1
    })
    this.getList()
  },
  gotoInformation(){
    wx.navigateTo({
      url: `/pages/information/information?name=${this.data.nickName}`
    })
  },
  onReachBottom: function() {
    if (this.data.total > this.data.limit * (this.data.offset + 1)) {
      this.setData({
        offset: this.data.offset + 1,
      });
      console.log("上拉加载:",this.data.offset)
      this.getList()
    }
  },

  onPullDownRefresh() {
    this.setData({
      publishList: [],
      offset: 1,
      total: 0,
    })
    console.log("下拉刷新:",this.data.offset)
    this.getList();
  },
  getList(){
    const {addweight} = this.data;
    if(addweight == 0){
      wx.showLoading({title:'加载中...'})
      personalService
        .getMyCollection({
          page:this.data.offset,
          size:this.data.limit
        })
        .then(res=>{
  
          this.setData({
            publishList:res.publishList,
            total:res.totalSize
          })
          wx.hideLoading();
          wx.stopPullDownRefresh();
        })
    }else if(addweight == 1){
      wx.showLoading({title:'加载中...'})
      personalService
        .getPublishListn({
          page:this.data.offset,
          size:this.data.limit
        })
        .then(res=>{
  
          this.setData({
            publishList:res.publishList,
            total:res.totalSize
          })
          wx.hideLoading();
          wx.stopPullDownRefresh();
        })
    }
  },
  gotoPostFn(e){
    const {publishid} = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/post/post?id=${publishid}`
    })
  } ,
  focusFn(e){
    const {publishid,index,collection} =  e.currentTarget.dataset;//当前所在页面的 index
    // if(!collection){
      indexService
      .chenkCollection({
        publishId:publishid,
        collection:!collection
      })
      .then(res => {
        this.getList()

      })
    // }
    
  },
  delFn(e){
    const {publishid} =  e.currentTarget.dataset;
    personalService
    .canclePublish({publishId:publishid})
    .then(res => {
      this.getList()
    })
  }

})


