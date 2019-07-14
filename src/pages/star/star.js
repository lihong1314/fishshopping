require('./star.less');

const { getStorage, setStorage } = require('../../utils/storage');
import '../../components/tip/tip.less';
import * as personalService from '../../services/personal';

Page({
  data:{
    isShowMod:false,
    offset: 1,
    limit: 20,
    total: 0,
    starList:[]
  },
  onShow(){
    
    
  },
  onLoad(){
   this.getList()
    
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
  cancelFocus(e){

    const {attention,attentionid,index} =  e.currentTarget.dataset;
    this.setData({
      isShowMod:true
    })

    personalService
    .addOrCancleAttention({
      attentionId:attentionid,
      attention:false
    })
    .then(res=>{
      this.getList();
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
      starList: [],
      offset: 1,
      total: 0,
    })
    console.log("下拉刷新:",this.data.offset)
    this.getList();
  },
  getList(){
    wx.showLoading({title:'加载中...'})
    personalService
    .getAttentionList({
      page:this.data.offset,
      size:this.data.limit
    })
    .then(res=>{
      wx.hideLoading()

      this.setData({
        total:res.totalSize,
        starList:res.publishList
      })
      wx.stopPullDownRefresh();
    })
    
  },
  gotoFansDetailFn(e){
    const {fansid} =  e.currentTarget.dataset;
    wx.navigateTo({
      url:`/pages/fansDetail/fansDetail?fansid=${fansid}`
    })
  }
})