require('./star.less');

const { getStorage, setStorage } = require('../../utils/storage');
import '../../components/tip/tip.less';
import * as personalService from '../../services/personal';
const account = require('../../services/account.js');
import * as indexService from '../../services/index'; 
Page({
  data:{
    isShowMod:false,
    offset: 1,
    limit: 10,
    total: 0,
    starList:[],
    tipcon:"还未关注其他用户"
  },
  onShow(){
    console.log("show")
    this.setData({
      starList:[],
    })
    this.getList()
  },
  onLoad(option){
    const {id,type,uname} = option
    if(type == '1'){
      wx.setNavigationBarTitle({
        title: uname+'的关注'
     })
     this.setData({
        tipcon:"暂未关注其他用户"
     })
    }
    if(type){
      this.setData({
        id,
        type
      },()=>{
        // this.getList()
      })
    }else{
      this.setData({
        id,
        type:0
      },()=>{
        // this.getList()
      })
    }
    
  },
  cancelFn(){
    this.setData({
      isShowMod:false
    })
  },
  sureFn(){
    this.setData({
      isShowMod:false,
      starList:[]
    })
 
    const { cuserId } = getStorage( 'USER_INFO' ) || {};
   
    personalService
    .addOrCancleAttention({
      cuserId,
      attentionId:this.data.attentionid,
      attention:false
    })
    .then(res=>{
      this.getList();
    })
  },
  cancelFocus(e){
    const {cuserId} = getStorage("USER_INFO") || {};
    const {attention,attentionid,index} =  e.currentTarget.dataset;
    if(cuserId == attentionid){
      return;
    }
    this.setData({
      isShowMod:true,
      attentionid
    })
    
  },
  onReachBottom: function() {
    if (this.data.total > this.data.limit * (this.data.offset)) {
      this.setData({
        offset: this.data.offset + 1,
      });
      this.getList()
    }
  },

  onPullDownRefresh() {
    this.setData({
      starList: [],
      offset: 1,
      total: 0,
    })
    this.getList();
  },
  getList(){
    wx.showLoading({title:'加载中...'})
    const { cuserId } = getStorage( 'USER_INFO' ) || {};
    const {id,type}=this.data;
    personalService
    .getAttentionList({
      cuserId:cuserId,
      attentionId:type == "1"?id:cuserId,
      page:this.data.offset,
      size:this.data.limit
    })
    .then(res=>{
      wx.hideLoading()
      if(res.publishList){
        this.setData({
          total:res.totalSize,
          starList: this.data.starList.concat(res.publishList)
        })
      }else{
        this.setData({
          total:res.totalSize,
          starList:null
        })
      }
      
      wx.stopPullDownRefresh();
    })
    
  },
  gotoFansDetailFn(e){
    const {fansid} =  e.currentTarget.dataset;
    wx.navigateTo({
      url:`/pages/fansDetail/fansDetail?fansid=${fansid}`
    })
  },
  onGotUserInfo: function (e) {
    const { cuserId,access } = getStorage( 'USER_INFO' ) || {};
    const {type} = e.currentTarget.dataset;
    if(cuserId){
      
      if(type == '1'){
        this.cancelFocus(e)
       
      }else if(type == '2'){
        this.focusFn(e)
      }
    }else{
      wx.showLoading({
        title: '授权中请稍后...',
        mask: true
      })
      if(e.detail.errMsg == "getUserInfo:fail auth deny"){
        wx.hideLoading();
        return
      }
      return account.bindAccountBySilent(e.detail).then(res => {
        setStorage( 'USER_INFO', res );
        this.setData({
          islogin:true
        })
        this.getList();
        const pages = getCurrentPages()
        const perpage = pages[pages.length - 1]
        perpage.onLoad()  
      })
    }
    
  },
  focusFn(e){
    const {attentionid,index,attention} =  e.currentTarget.dataset;//当前所在页面的 index
    const { cuserId } = getStorage( 'USER_INFO' ) || {};
    if(attentionid == cuserId){
      return;
    }
      personalService
        .attentionFansOrCalcle({
          fansId:attentionid,
          attentionFans:!attention
        })
        .then(res => {
          let list = this.data.starList;
          list[index].attention = res.attentionFans;
          this.setData({
            starList:list
          })
        })

    
  },
})