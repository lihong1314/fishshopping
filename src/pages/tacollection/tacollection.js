
require('./tacollection.less');

import '../../components/tip/tip.less';
import '../../components/disable/tip.less';
const { getStorage, setStorage } = require('../../utils/storage');
import * as personalService from '../../services/personal'; 
import * as indexService from '../../services/index'; 
import * as storeService from '../../services/store'; 
const account = require('../../services/account.js');
Page({
  data:{
    isShowMod:false,
    collectShow:true,
    postShow:false,
    offset: 1,
    limit: 10,
    total: 0,
    addweight:0,
    publishList:[],
    disableFlag:false
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
    
  },
  onLoad(option){
    const {id,uname} = option;
    this.setData({
      id
    })
   
    this.getList()
    if(uname){
      wx.setNavigationBarTitle({
        title: uname+'的收藏'
     })
    }
   
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
      addweight:0,
      publishList:[],
      offset: 1,
      total: 0
    })
    this.getList()
  },
  postFn(){
    this.setData({
      postShow:true,
      collectShow:false,
      addweight:1,
      publishList:[],
      offset: 1,
      total: 0
    })
    this.getList()
  },
  gotoInformation(){
    wx.navigateTo({
      url: `/pages/information/information?name=${this.data.nickName}`
    })
  },
  onReachBottom: function() {
    if (this.data.total > this.data.limit * (this.data.offset)) {
      this.setData({
        publishList: [],
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
    const {id}=this.data
    if(addweight == 0){
      wx.showLoading({title:'加载中...'})
      personalService
        .getMyCollection({
          cuserId:id,
          page:this.data.offset,
          size:this.data.limit
        })
        .then(res=>{
          wx.hideLoading();
          if(!res.publishList){
            this.setData({
              publishList:null,
              total:res.totalSize
            })
          }else{
            var list = res.publishList;
            list.map(item=>{
              item.content = item.content.split('&hc').join('\n')
              return item;
            })
            
            this.setData({
              publishList:this.data.publishList.concat(list),
              total:res.totalSize
            })
          }
          
          
          wx.stopPullDownRefresh();
        })
    }else if(addweight == 1){
      wx.showLoading({title:'加载中...'})
      storeService
      .getAttentionList({
        cuserId:id,
        page:this.data.offset,
        size:this.data.limit
      })
      .then(res=>{
        
        wx.hideLoading();
        if(!res.shopList){
          this.setData({
            publishList:null,
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
            publishList:this.data.publishList.concat(list),
            total:res.totalSize
          })
        }
        
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
        this.setData({
          publishList:[]
        })
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
  },
  gotoShopapp(){
    console.log("点了")
  wx.navigateToMiniProgram({
    appId: 'wx64ad30b0484c1470',
    path: `page/index/index?id=${this.data.shopId}`,
    extraData: {
      foo: 'bar'
    },
    envVersion: 'develop',
    success(res) {
      console.log("成功")
    }


    })
  },
  gotofans(e){
    wx.navigateTo({
      url:`/pages/fans/fans?id=${this.data.cuserId}`
    })
  },
  gotostar(){
    wx.navigateTo({
      url:`/pages/star/star?id=${this.data.cuserId}`
    })
  },
  inStorFn(e){
    const {shopid} = e.currentTarget.dataset;
    wx.navigateTo({
      url:`/pages/stordetail/stordetail?shopid=${shopid}`
    })
  },
  onGotUserInfo(e){
    const { cuserId,access } = getStorage( 'USER_INFO' ) || {};
    if(cuserId){
      this.focusFn(e)
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
        const pages = getCurrentPages()
        const perpage = pages[pages.length - 1]
        perpage.onLoad()  
      }, err => {
        // wx.redirectTo({ url: '/pages/personal/personal'})
      })
    }
  }
})


