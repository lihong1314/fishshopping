require('./fans.less');

const { getStorage, setStorage } = require('../../utils/storage');
import '../../components/tip/tip.less';
import * as personalService from '../../services/personal';
const account = require('../../services/account.js');
Page({
  data:{
    isShowMod:false,
    offset: 1,
    limit: 10,
    total: 0,
    fansList:[],
    tipcon:'暂无关注您的粉丝，发布淘贴获取更多关注~'
  },
  onShow(){ 
    this.setData({
      fansList:[]
    }) 
    this.getList()
  },
  onLoad(option){
    const {id,type,uname} = option;
    
    
    if(type == '1'){
      wx.setNavigationBarTitle({
        title: uname+'的粉丝',
     })
     this.setData({
      tipcon:'暂未获得粉丝关注'
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
      isShowMod:false
    })
    
    personalService
    .attentionFansOrCalcle({
      fansId:this.data.fansid,
      attentionFans:!this.data.attention
    })
    .then(res => {
      console.log(res)
      let list = this.data.fansList;
      list[this.data.index].attentionFans = res.attentionFans;
      this.setData({
        fansList:list
      })
    })
  },
  cancelFocus(){
    this.setData({
      isShowMod:true
    })
  },
  focusFn(e){
    
    const {attention,fansid,index} =  e.currentTarget.dataset;
    const {cuserId} = getStorage("USER_INFO") || {};
    // console.log('attention:',fansid)
    if(cuserId == fansid){
      return;
    }
    if(attention){
      this.setData({
        isShowMod:true,
        fansid,
        index,
        attention
      })
    }else{
      this.setData({
        isShowMod:false,
        index,
        fansid,
        attention
      })
      personalService
        .attentionFansOrCalcle({
          fansId:fansid,
          attentionFans:!attention
        })
        .then(res => {
          console.log(res)
          let list = this.data.fansList;
          list[index].attentionFans = res.attentionFans;
          this.setData({
            fansList:list
          })
        })
    }
 

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
      fansList: [],
      offset: 1,
      total: 0,
    })
    console.log("下拉刷新:",this.data.offset)
    this.getList();
  },
  getList(){
    wx.showLoading({title:'加载中...'})
    const {id,type} = this.data;
    const {cuserId} = getStorage("USER_INFO") || {};
    personalService
      .getFansList({
        cuserId:cuserId,
        attentionId:type == "1"?id:cuserId,
        page:this.data.offset,
        size:this.data.limit
      })
      .then(res=>{
        wx.hideLoading()
        if(res.publishList){
          this.setData({
            fansList:this.data.fansList.concat(res.publishList),
            total:res.totalSize
          })
        }else{
          this.setData({
            fansList:null,
            total:res.totalSize
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
          this.getList()
          const pages = getCurrentPages()
          const perpage = pages[pages.length - 1]
          perpage.onLoad()  
        }, err => {
          // wx.redirectTo({ url: '/pages/personal/personal'})
        })
      }
      
    
  }
})