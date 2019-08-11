
require('./personal.less');

import '../../components/tip/tip.less';
import '../../components/disable/tip.less';
const { getStorage, setStorage } = require('../../utils/storage');
import * as personalService from '../../services/personal'; 
import * as indexService from '../../services/index'; 
// import { identifier } from '@babel/types';
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
    disableFlag:false,
    ruzhuFn:false,
    islogin:false,
    nickName:'昵称',
    fansNum:0,
    attentionCNum:0,
    attentionShopNum:0
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
    this.showF()
  },

  showF(){
    const { cuserId } = getStorage( 'USER_INFO' ) || {};
    if(cuserId){
      this.setData({
          islogin:true
        })
    }
  
  if(this.data.islogin){
    
    const {latitude,longitude} = getStorage('location') ||{};
    personalService
    .getmine2({cuserId,longitude,latitude})
    .then(res => {
 
      this.setData({
        publishList:[],
        cuserId,
        attentionCNum:res.attentionCNum,
        attentionShopNum:res.attentionShopNum,
        fansNum:res.fansNum,
        publishNum:res.publishNum,
        avatarUrl:res.cUserIcon,
        nickName:res.cUserName,
        ...res
      })
    })
 
    this.getList()
  }

  },
  onLoad(){
    const {avatarUrl,nickName,cuserId,access} =  getStorage('USER_INFO') || {}
    
    if(cuserId){
      
      this.setData({
          islogin:true,
        })
    }
    if(this.data.islogin){
      
      if(access != "Y" && access){
        this.setData({
          disableFlag:true
        })
      }else{
        this.setData({
          cuserId
        })
      }
    }else{
      this.setData({
        ruzhuFn:true
      })
    }
    
   
  },
  gotoHelp(){
    wx.navigateTo({
      url: `/pages/help/help`
    })
  },
  collectFn(){
    const {cuserId} =  getStorage('USER_INFO') || {}
    this.setData({
      collectShow:true,
      postShow:false,
      addweight:0,
      publishList:[],
      offset: 1,
      total: 0
    })
    if(cuserId){
      
      this.getList()
    }
    
  },
  postFn(){
    const {cuserId} =  getStorage('USER_INFO') || {}
    this.setData({
      postShow:true,
      collectShow:false,
      addweight:1,
      publishList:[],
      offset: 1,
      total: 0
    })
    if(cuserId){
      this.getList()
    }
  },
  gotoInformation(){
    wx.navigateTo({
      url: `/pages/information/information?name=${this.data.nickName}`
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
      publishList: [],
      offset: 1,
      total: 0,
    })
    console.log("下拉刷新:",this.data.offset)
    this.getList();
  },
  getList(){
    const {addweight} = this.data;
    const { cuserId } = getStorage( 'USER_INFO' ) || {};
    if(addweight == 0){
      wx.showLoading({title:'加载中...'})
      personalService
        .getMyCollection({
          cuserId,
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
            console.log("列表:",res)
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
        .catch(err=>{
          wx.hideLoading();
        })
    }else if(addweight == 1){
      wx.showLoading({title:'加载中...'})
      personalService
        .getPublishListn({
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
            console.log("列表:",res)
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
        .catch(err=>{
          wx.hideLoading();
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
        // let list = this.data.publishList;
        // list[index].collection = res.collection
        this.setData({
          publishList:[]
        })
        this.getList()

      })
    // }
    
  },
  delFn(e){
    let that = this;
    wx.showModal({
      title: '',
      content: '确定要删除该淘贴？',
      showCancel: true,//是否显示取消按钮
      cancelText:"取消",//默认是“取消”
      confirmText:"确定",//默认是“确定”
      success: function (res) {
        if (res.confirm) {
          const {publishid} =  e.currentTarget.dataset;
          personalService
          .canclePublish({publishId:publishid})
          .then(res => {
            that.setData({
              publishList:[]
            })
            
            that.getList()
          })
        } else if (res.cancel) {

        }
        
      },
      fail: function (res) { },//接口调用失败的回调函数
      complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
   })
    
  },
  gotoShopapp(){
    wx.navigateToMiniProgram({
      appId: 'wx64ad30b0484c1470',
      path: `page/index/index?id=${this.data.shopId}`,
      // path: `page/index/index`,
      extraData: {
        foo: 'bar'
      },
      envVersion: 'develop',
      success(res) {
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
  gotofocusstore(){
    wx.navigateTo({
      url:`/pages/focusStore/focusStore`
    })                    
  },
  onGotUserInfo: function (e) {
    const {type} =  e.currentTarget.dataset;
    const { cuserId,access } = getStorage( 'USER_INFO' ) || {};
    if(cuserId){
      if(type == "2"){
        this.gotostar()
      }else if(type == '1'){
        this.gotofans()
      }else if(type == '3'){
        this.gotofocusstore()
      }else if(type == "4"){
        this.gotoInformation()
      }else if(type == '5'){
        this.setData({
          islogin:true,
          ruzhuFn:false
        })
        this.showF()
      }
      
    }else{
      wx.showLoading({
        title: '授权中请稍后...',
        mask: true
      })
      if(e.detail.errMsg == "getUserInfo:fail auth deny"){
        wx.hideLoading();
        this.setData({
          ruzhuFn:false,
          islogin:false,
          nickName:'昵称',
          fansNum:0,
          attentionCNum:0,
          attentionShopNum:0
        })
        return
      }
      return account.bindAccountBySilent(e.detail).then(res => {
       
        setStorage( 'USER_INFO', res );
        this.setData({
          islogin:true,
          ruzhuFn:false
        })
        if(type == '5'){
          this.setData({
            islogin:true,
            ruzhuFn:false
          })
        
        }
        this.showF()
        const pages = getCurrentPages()
        const perpage = pages[pages.length - 1]
        perpage.onLoad()  
      }, err => {
        wx.redirectTo({ url: '/pages/personal/personal'})
      })
      
    }
    
    
  },
  cancelDen(){
    this.setData({
      ruzhuFn:false
    })
  }

})


