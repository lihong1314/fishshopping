require('./index.less');

const { getStorage, setStorage } = require('../../utils/storage');
const { checkLogin, message } = require('../../utils/index.js');
import '../../components/tip/tip.less';
import * as wxp from '../../services/wxp';
import * as indexService from '../../services/index'; 

const App = getApp();



Page({
  data:{
    ruzhuFn:false,
    distanceArr:[5,10,20,30,50,80,100,150],
    distanceNum:null,
    tuijianFl:false,
    distancebFl:true,
    addjiantou:false,
    addweight:0,
    distance:20,
    isShowMod:false,
    windowHeight:0,
    windowWidth:0,
    offset: 1,
    limit: 10,
    total: 0,
    tuijianList:[]
  },
  initLocation() {
    wxp
      .getLocation()
      .then((res) =>{
        // console.log('res:',res)
        setStorage('location',{latitude:res.latitude,longitude:res.longitude})
        this.setData({
          location:{latitude:res.latitude,longitude:res.longitude}
        })
      })
      
  },
  selectList(e){
    const {num} = e.currentTarget.dataset;
    this.setData({
      distanceNum:num,
      tuijianFl:false,
      addjiantou:false,
      distance:this.data.distanceArr[num]
    })
    this.getList()
  },
  showdistanceb(){
    this.setData({
      tuijianFl:!this.data.tuijianFl,
      addjiantou:!this.data.addjiantou
    })
  },
  hiddenFn(){
    this.setData({
      tuijianFl:false,
      addjiantou:false
    })
  },
  recommendFn(){
    this.setData({
      distancebFl:true,
      addweight:0
    })
    this.getList()
  },
  getFocus(){
    this.setData({
      distancebFl:false,
      addweight:1
    })
    this.getList()
    
  },
  onShow(){
    
    let aShow  = getStorage('aShow') || '';
    setStorage('imgUrls',[])
    if(aShow){
      setStorage('aShow',true);
      setStorage('imgUrls',[]);//清除图片数组中的数据
    }
    var page_this = this;
    var obj=wx.createSelectorQuery();
    
    wx.getSystemInfo({
          success: (res) => {
            let height = 0;
            obj.selectAll('.tabtitle').boundingClientRect();
            obj.exec(function (rect) {
                height = rect[0][0].height
                page_this.setData({
                  windowHeight: res.windowHeight - height,
                  windowWidth: res.windowWidth,
                  windowIsBang: (res.windowWidth/res.windowHeight<0.5 ? true : false)//判断手机是否有刘海屏
                })
            }) ;
            
          }
      })

    this.setData({
      tuijianFl:false,
      addjiantou:false
    })
    const refresh = getStorage("refresh") || '';
    setStorage("refresh",'0')
    if(refresh == '1'){
      this.setData({
        addweight:1
      })
      this.getList();
    }
    
    // this.getList();
  },
  tailorTo(){
    const { cuserId } = getStorage( 'USER_INFO' ) || {};
    if(cuserId){
      indexService
      .checkPublish()
      .then(res => {
        if(res){
          this.setData({
            ruzhuFn:false
          })
          wx.navigateTo({
            url: `/pages/tailor/tailor?index=1`
          })
        }else{
          this.setData({
            ruzhuFn:true
          })
        }
       
      })
    }
    

   
  },
  onLoad(option){
    // const {refresh} = option;
    let _this = this;
    _this.setData({
      navH: App.globalData.navHeight
    })
    this.initLocation()
    
    const { cuserId } = getStorage( 'USER_INFO' ) || {};
    
    if(cuserId){
      // console.log(refresh);
      
      this.getList();
      
    }else{
      checkLogin()
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
  },
  cancelFocus(){
    this.setData({
      isShowMod:true
    })
  },
  focusFn(e){
    const {publishid,index,collection} =  e.currentTarget.dataset;//当前所在页面的 index
    // if(!collection){
      indexService
      .chenkCollection({
        publishId:publishid,
        collection:!collection
      })
      .then(res => {
        let list = this.data.tuijianList;
        list[index].collection = res.collection
        this.setData({
          tuijianList:list
        })

      })
    // }
    
  },
  changeswiper(e){
    var index = e.detail.current;//当前所在页面的 index
 
    if(index == 0) { //第一屏 推荐

      this.setData({
        distancebFl:true,
        addweight:0
      })

    } else if(index == 1) {//第二屏 关注

      this.setData({
        distancebFl:false,
        addweight:1
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
      // tuijianList: [],
      offset: 1,
      total: 0,
    })
    console.log("下拉刷新:",this.data.offset)
    this.getList();
  },
  getList(){
    let addweight = this.data.addweight;
    if(addweight == 0){
      const {latitude,longitude} = getStorage('location');
      wx.showLoading({title:'加载中...'})
        indexService
        .getRecommend({
          latitude:latitude,
          longitude:longitude,
          distance:this.data.distance,
          page:this.data.offset,
          size:this.data.limit
        })
        .then(res => {
          console.log("列表:",res.publishList)
          
          this.setData({
            tuijianList:res.publishList,
            total:res.totalSize
          })
          wx.stopPullDownRefresh();
          wx.hideLoading();
        })
    }else if(addweight == 1){
      wx.showLoading({title:'加载中...'})
      indexService
      .getInterestList({
        page:this.data.offset,
        size:this.data.limit
      })
      .then(res=>{
        console.log('关注：',res)
        this.setData({
          tuijianList:res.publishList,
          total:res.totalSize
        })
        wx.stopPullDownRefresh();
        wx.hideLoading();
      })
    }
   


      
    
  },
  gotoPostFn(e){
    const {publishid} = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/post/post?id=${publishid}`
    })
  }
})