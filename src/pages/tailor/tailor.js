
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

    wx.chooseImage({ 
      count: 1, // 默认9 // 选择图片数量，选项采用只能选择1张图片 
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，选项采用压缩图 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function (res) { 
          //  console.log("选择：",res)
        that.setData({
          cutImage: 'show',
          addtribeConShow: 'hide',
          xx: true
        });
        that.wecropper.pushOrign(res.tempFilePaths[0]);
      },
      fail:function(){
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
      } 
    });
    
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
    var that = this
    const {index,name} = option;
    this.setData({
      index,
      name:name?name:''
    })
    this.chooseimg(index);
    
    const {
      cropperOpt
    } = this.data
    // console.log("index:",index)
    new WeCropper(cropperOpt)
      .on('ready', (ctx) => { })
      .on('beforeImageLoad', (ctx) => {
        // console.log(`before picture loaded, i can do something`)
        // console.log(`current canvas context:`, ctx)
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        // console.log(`picture loaded`)
        // console.log(`current canvas context:`, ctx)
        wx.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => {
        // console.log(`before canvas draw,i can do something`)
        // console.log(`current canvas context:`, ctx)
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
          list.push(src)
          setStorage('imgUrls',list);
          wx.redirectTo({
            url: `/pages/release/release`
          })
        }else if(this.data.index == 2){
          wx.redirectTo({
            url: `/pages/information/information?src=${src}&name=${this.data.name}`
          })
        }
      }
    })
  },
  upload(page, path){
    let newUrl = __DEV__ ? `https://test-tao.xiaoxiaohb.com/`:`https://www.xiaoxiaohb.com/`;
    // let newUrl = __DEV__ ? `https://test-tao.xiaoxiaohb.me/`:`https://www.xiaoxiaohb.com/`;
    // let newUrl = `https://www.xiaoxiaohb.com/`;
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    }),
      wx.uploadFile({
        url: newUrl + "street/file/upload",
        filePath: path[0], 
        name: 'file',
        header: { "Content-Type": "multipart/form-data" },
        formData: {
          //和服务器约定的token, 一般也可以放在header中
          'session_token': wx.getStorageSync('LOGIN_SESSION_FFAN')
        },
        success: function (res) {
          // console.log("图片上传：",res);
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
          // console.log(e);
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


  