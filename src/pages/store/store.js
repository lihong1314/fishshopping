require('./store.less');

const { getStorage, setStorage } = require('../../utils/storage');
import * as storeService from '../../services/store'; 

Page({
  data:{
    shopList:[],
    offset:1,
    limit:10,
    total: 0
  },
  onShow(){
    
  },
  onLoad(){
    this.getList()
  },
  onReachBottom: function() {
    if (this.data.total > this.data.limit * (this.data.offset + 1)) {
      this.setData({
        offset: this.data.offset + 1,
      });
      this.getList()
    }
  },

  onPullDownRefresh() {
    this.setData({
      // shopList: [],
      offset: 1,
      total: 0,
    })
    this.getList();
  },
  getList(){
    wx.showLoading({title:'加载中...'})
    const {latitude,longitude} = getStorage('location');
    storeService
    .getStoreList({
      latitude:1,
      longitude:2,
      distance:10,
      page:this.data.offset,
      size:this.data.limit
    })
    .then(res=>{
      let list = res.shopList;
      list.images
      list.map(item=>{
        item.images = item.images.filter( (list,index) => {
          return index <= 2
        })
      })
      this.setData({
        shopList:list,
        total:res.totalSize
      })
      wx.hideLoading();
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