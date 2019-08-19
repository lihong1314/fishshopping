require('./focusStore.less');

const { getStorage, setStorage } = require('../../utils/storage');
import '../../components/tip/tip.less';

import * as storeService from '../../services/store';

Page({
  data:{
    isShowMod:false,
    offset: 1,
    limit: 10,
    total: 0,
    shopList:[]
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
  cancelFocus(){
    this.setData({
      isShowMod:true
    })
  },
  intoDetailFn(){
    wx.navigateTo({
      url: `/pages/stordetail/stordetail`
    })
  },
  onReachBottom: function() {
    if (this.data.total > this.data.limit * (this.data.offset)) {
      this.setData({
        offset: this.data.offset + 1,
      });
      console.log("上拉加载:",this.data.offset)
      this.getList()
    }
  },

  onPullDownRefresh() {
    this.setData({
      shopList: [],
      offset: 1,
      total: 0,
    })
    console.log("下拉刷新:",this.data.offset)
    this.getList();
  },
  getList(){
    wx.showLoading({title:'加载中...'})
    const {cuserId} = getStorage("USER_INFO") || {};
    storeService
    .getAttentionList({
      cuserId,
      page:this.data.offset,
      size:this.data.limit
    })
    .then(res=>{
      
      wx.hideLoading();
      if(!res.shopList){
        this.setData({
          shopList:null,
          total:res.totalSize
        })
      }else{
        let list = res.shopList;
        list.images
        list.map(item=>{
          item.images = item.images.filter( (list,index) => {
            return index <= 2
          })
        })
        this.setData({
          shopList:this.data.shopList.concat(list),
          total:res.totalSize
        })
      }
      
      wx.stopPullDownRefresh();
    })
    
  },
  inStorFn(e){
    const {shopid} = e.currentTarget.dataset;
    wx.navigateTo({
      url:`/pages/stordetail/stordetail?shopid=${shopid}`
    })
  }
})