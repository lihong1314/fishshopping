
require('./tailor.less');

import * as releaseService from '../../services/release';
const { getStorage, setStorage } = require('../../utils/storage');

import WeCropper from '../../utils/we-cropper.js'
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 100;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xx: false,
    cropperOpt: {  //基础设置 
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300
      }
    },
    img: '',
    clickFlg:false
  },
  //选择图片
  chooseimg: function (addweight) {
    var that = this;
    releaseService
    .getImage()
    .then(res =>{
        that.setData({
          cutImage: 'show',
          addtribeConShow: 'hide',
          xx: true
        });
        that.wecropper.pushOrign(res.res.tempFilePaths[0]);
        
    })
    .catch(err=>{
      // console.log("addweight:",addweight)
      if(addweight ==1){
        wx.switchTab({
          url: `/pages/index/index`
        })
      }else if(addweight ==0){
        wx.redirectTo({
          url: `/pages/release/release`
        })
      }else if(addweight ==2){
        wx.redirectTo({
          url: `/pages/information/information`
        })
      }
      
    })
    
  },
  onUnload(){
    const {clickFlg} = this.data;
    
    if(!clickFlg){
      this.setData({
        clickFlg:true
      })
      let pages = getCurrentPages();
      let prevPage;
      prevPage = pages[pages.length - 2]; //上一个页面
      prevPage.setData({
        activeCategoryId: 0,
      })
    }else{
      return;
    }
    
    
  },
  onShow(){
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option){
    
    const {index} = option;
    this.setData({
      index
    })
    this.chooseimg(index);
    var that = this
    const {
      cropperOpt
    } = this.data
    
    new WeCropper(cropperOpt)
      .on('ready', (ctx) => { })
      .on('beforeImageLoad', (ctx) => {
        console.log(`before picture loaded, i can do something`)
        console.log(`current canvas context:`, ctx)
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        console.log(`picture loaded`)
        console.log(`current canvas context:`, ctx)
        wx.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => {
        console.log(`before canvas draw,i can do something`)
        console.log(`current canvas context:`, ctx)
      })
      .updateCanvas();
  },
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage() {
    var that = this;
    this.setData({
      clickFlg:true
    })
    that.wecropper.getCropperImage((src) => {
      if (src) {
        //此处添加用户确定裁剪后执行的操作 src是截取到的图片路径

        if(this.data.index == 1 || this.data.index == 0){
          that.setData({
            xx: false,
            img: src,
          })
          let list =  getStorage('imgUrls') || [];
          list.unshift(src)
          setStorage('imgUrls',list);
          wx.redirectTo({
            url: `/pages/release/release`
          })
        }else if(this.data.index == 2){
          wx.redirectTo({
            url: `/pages/information/information?src=${src}`
          })
        }
      }
    })
  },
  upload(page, path){
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    }),
      wx.uploadFile({
        url: "https://www.xiaoxiaohb.com/street/file/upload",
        filePath: path[0], 
        name: 'file',
        header: { "Content-Type": "multipart/form-data" },
        formData: {
          //和服务器约定的token, 一般也可以放在header中
          'session_token': wx.getStorageSync('LOGIN_SESSION_FFAN')
        },
        success: function (res) {
          console.log("图片上传：",res);
          if (res.statusCode != 200) { 
            wx.showModal({
              title: '提示',
              content: '上传失败',
              showCancel: false
            })
            return;
          }
          var data = res.data
          page.setData({  //上传成功修改显示头像
            src: path[0]
          })
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
  }
  })


  