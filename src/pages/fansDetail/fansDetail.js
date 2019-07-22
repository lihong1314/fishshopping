require('./fansDetail.less');

const { getStorage, setStorage } = require('../../utils/storage');
import '../../components/tip/tip.less';
import * as personalService from '../../services/personal';
import * as indexService from '../../services/index'; 

Page({
  data:{
    isShowMod:false,
    offset: 1,
    limit: 10,
    total: 0,
    list:[],
    attention:true
  },
  onShow(){
    
    
  },
  onLoad(option){
    const {fansid} = option;
    this.setData({
      fansid
    })
    personalService
   .getmine({cuserId:fansid})
   .then(res => {
     this.setData({
      attentionCNum:res.attentionCNum,
      attentionShopNum:res.attentionShopNum,
      fansNum:res.fansNum,
      publishNum:res.publishNum,
      cUserIcon:res.cUserIcon,
      cUserName:res.cUserName
     })
   })
    this.getList()
  },
  maxFn(e){
    const {num} = e.currentTarget.dataset;
    console.log(num)
    this.setData({
      imgSrc:this.data.imgArr[num],
      maxFlg:true
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
  cancelFn(){
    this.setData({
      isShowMod:false
    })
  },
  sureFn(){
    this.setData({
      isShowMod:false
    })
    const { cuserId } = getStorage( 'USER_INFO' ) || {};
    personalService
    .addOrCancleAttention({
      cuserId,
      attentionId:this.data.fansid,
      attention:!this.data.attention
    })
    .then(res=>{
      this.setData({
        attention:res.attention
      })
    })
  },
  cancelFocus(){
    this.setData({
      isShowMod:true
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
      // list: [],
      offset: 1,
      total: 0,
    })
    console.log("下拉刷新:",this.data.offset)
    this.getList();
  },
  getList(){
    wx.showLoading({title:'加载中...'})
    personalService
    .attentionDetailList({
      attentionId:this.data.fansid,
      page:this.data.offset,
      size:this.data.limit
    })
    .then(res=>{
      this.setData({
        list:res.publishList,
        total:res.totalSize,
        attention:res.attention
      })
      wx.stopPullDownRefresh();
      wx.hideLoading()
    })
  },
  gotoPostFn(e){
    const {publishid} = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/post/post?id=${publishid}`
    })
  },
  collectionFn(e){
    const {publishid,index,collection} =  e.currentTarget.dataset;//当前所在页面的 index
    
      indexService
      .chenkCollection({
        publishId:publishid,
        collection:!collection
      })
      .then(res => {
        let list = this.data.list;
        list[index].collection = res.collection
        this.setData({
          list
        })

      })
    
  },
  focusFn(){
    const { cuserId } = getStorage( 'USER_INFO' ) || {};
      personalService
      .addOrCancleAttention({
        cuserId,
        attentionId:this.data.fansid,
        attention:!this.data.attention
      })
      .then(res=>{
        this.setData({
          attention:res.attention
        })
      })
  }
})