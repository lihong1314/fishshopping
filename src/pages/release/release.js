
require('./release.less');
import '../../components/tip/tip.less';
import * as releaseService from '../../services/release';
const { getStorage, setStorage } = require('../../utils/storage');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
Page({
  data:{
    src:'',
    // imgUrls: [
    //   'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
    //   'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
    //   'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    // ],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    current:0,
    imgUrls:[],
    releaseValue:'',
    btnStatus:false,
    isShow:true,
    kongShow:false,
    publishImages:[],
    address:'',
    clickflg:false,
    isShowMod:false
  },
  onLoad( option ) {
    let that = this;
    let list  = getStorage('imgUrls') || null;
    if(list.length<=0){
      this.setData({
        isShow:false,
        kongShow:true
      })
    }
    this.setData({
      imgUrls:list
    })
    setStorage('imgUrls',list);
    let qqmapsdk = new QQMapWX({
        key: 'HUZBZ-ND7W4-MA4UY-X2QFA-XXT2V-BBBTX'
    });
    const {latitude,longitude} = getStorage('location');
    qqmapsdk.reverseGeocoder({
      location: {
        latitude,
        longitude
      },
      success(res){
        let address = res.result.address;
        that.setData({
          address
        })
      }
    })
  },
  swiperChange: function (e) {
    var that = this;
    if (e.detail.source == 'touch') {
      that.setData({
        current: e.detail.current
      })
    }
  },
  releaseFn(){//发布
    this.setData({
      clickflg:true
    })
    let that = this;
    wx.showLoading({title:'加载中...'})

    const {imgUrls,releaseValue} = this.data;
   

    
    
    new Promise((resolve, reject) => {
      imgUrls.map((index,item)=>{
        this.upload(that,index,item);
      })
    })
    
    setTimeout(()=>{
      console.log("图片列表:",this.data.publishImages)
      const {latitude,longitude} = getStorage('location');
      const {cuserId} = getStorage('USER_INFO');
      releaseService
      .publish({
        cuserId,
        content:releaseValue,
        latitude,
        longitude,
        location:this.data.address,
        publishImages:this.data.publishImages
      })
      .then(res => {
        // console.log('发布:',res)
          wx.showToast({title: '发布成功'})
          setTimeout(()=>{
            wx.switchTab({
              url: `/pages/index/index`
            })
          },1000)
      })
    },2000)
   
    

  },
  delFn(e){
    console.log("arr:",this.data.imgUrls)
    const {index} = e.currentTarget.dataset;
    
    let list = this.data.imgUrls;
    list.splice(index,1);
    if(list.length==0){
      current = -1;
    }
    console.log("2:",list)
    let current=this.data.current;
    

    if(list.length<=0){
      this.setData({
        isShow:false,
        kongShow:true
      })
    }
    
    this.setData({
      imgUrls:list,
      current
    })

    setStorage('imgUrls',list);
  },
  addFn(){
    wx.navigateTo({
      url: `/pages/tailor/tailor?index=0`
    })
    
  },
  onShow() {
    
    let aShow = getStorage("aShow") || '';

    if(aShow){
      
      // setStorage('aShow',true);
    }
    
  },
  addReleaseCon(e){
    this.setData({
      releaseValue:e.detail.value
    })
    this.checkValue()
    
  },
  checkValue(){
    if(this.data.releaseValue != '' && this.data.imgUrls.length >= 0){
      this.setData({
        btnStatus:true
      })
    }else{
      this.setData({
        btnStatus:false
      })
    }
  },
  upload(page, path,index){
    let that = this;
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    })
      wx.uploadFile({
        url: "https://www.xiaoxiaohb.com/street/file/upload",
        filePath: path, 
        name: 'file',
        header: { "Content-Type": "multipart/form-data;charset=UTF-8" },
        formData: {
          //和服务器约定的token, 一般也可以放在header中
          'session_token': wx.getStorageSync('LOGIN_SESSION_FFAN')
        },
        success: function (res) {
          console.log(res.data)
          var obj = JSON.parse(res.data);//转换为json对象obj
          if (res.code == 0 || res.code == 200) { 
            wx.showModal({
              title: '提示',
              content: `已上传${index}张图片`,
              showCancel: false
            })
            
          }
          let list = that.data.publishImages;
          list[index]={};
          list[index].imageOrder = index;
          list[index].imageUrl = obj.data.imageUrl;
          // list.push(list[index]);
          that.setData({
            publishImages:list
          })
          // var data = res.data
          // page.setData({  //上传成功修改显示头像
          //   src: path[0]
          // })
        },
        fail: function (e) {
          console.log(e);
          wx.showModal({
            title: '提示',
            content: '上传失败',
            showCancel: false
          })
        },
        complete: function () {
          wx.hideToast();  //隐藏Toast
        }
      })
  },
  promiseCallBack(){
    return new Promise((resolve,reject)=>{
        setTimeout(resolve,2000,'done');
    })
  },
  onUnload(){
    if(this.data.clickflg){
      return;
    }else{
      wx.switchTab({
        url: `/pages/index/index`
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
    wx.switchTab({
      url: `/pages/index/index`
    })
    
  }
})


