require('./fans.less');

const { getStorage, setStorage } = require('../../utils/storage');
import '../../components/tip/tip.less';
import * as personalService from '../../services/personal';

Page({
  data:{
    isShowMod:false,
    offset: 1,
    limit: 20,
    total: 0,
    fansList:[]
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
    // console.log('attention:',fansid)

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
      fansList: [],
      offset: 1,
      total: 0,
    })
    console.log("下拉刷新:",this.data.offset)
    this.getList();
  },
  getList(){
    wx.showLoading({title:'加载中...'})
    personalService
      .getFansList({
        page:this.data.offset,
        size:this.data.limit
      })
      .then(res=>{

        this.setData({
          fansList:res.publishList,
          total:res.totalSize
        })
        wx.hideLoading()
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