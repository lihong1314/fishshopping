require('./star.less');

const { getStorage, setStorage } = require('../../utils/storage');
import '../../components/tip/tip.less';
import * as personalService from '../../services/personal';
import { identifier } from '@babel/types';
const account = require('../../services/account.js');
Page({
  data:{
    isShowMod:false,
    offset: 1,
    limit: 10,
    total: 0,
    starList:[],
    tipcon:"您还没有关注任何用户哦！"
  },
  onShow(){
    
    this.setData({
      starList:[],
    })
  },
  onLoad(option){
    const {id,type,uname} = option
    this.setData({
      id
    })
    this.getList()
    if(type == '1'){
      wx.setNavigationBarTitle({
        title: uname+'的粉丝',
        tipcon:"他还没有关注任何用户哦！"
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
    // const {attention,attentionid,index} =  e.currentTarget.dataset;
 
    const { cuserId } = getStorage( 'USER_INFO' ) || {};
    // console.log("attentionid:",attentionid)
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
    // const { cuserId } = getStorage( 'USER_INFO' ) || {};
    // console.log("attentionid:",attentionid)
    // personalService
    // .addOrCancleAttention({
    //   cuserId,
    //   attentionId:attentionid,
    //   attention:false
    // })
    // .then(res=>{
    //   this.getList();
    // })
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
      starList: [],
      offset: 1,
      total: 0,
    })
    console.log("下拉刷新:",this.data.offset)
    this.getList();
  },
  getList(){
    wx.showLoading({title:'加载中...'})
    // const { cuserId } = getStorage( 'USER_INFO' ) || {};
    const {id}=this.data;
    personalService
    .getAttentionList({
      cuserId:id,
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
    if(cuserId){
      this.cancelFocus(e)
      
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
        this.getList();
        const pages = getCurrentPages()
        const perpage = pages[pages.length - 1]
        perpage.onLoad()  
      })
    }
    
  }
})