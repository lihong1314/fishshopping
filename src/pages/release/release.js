
require('./release.less');
import '../../components/tip/tip.less';
import * as releaseService from '../../services/release';
const { getStorage, setStorage } = require('../../utils/storage');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
Page({
  data: {
    src: '',
    // imgUrls: [
    //   'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
    //   'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
    //   'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    // ],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    current: 0,
    imgUrls: [],
    releaseValue: '',
    btnStatus: false,
    isShow: true,
    kongShow: false,
    publishImages: [],
    address: '',
    clickflg: false,
    isShowMod: false,
    con:'',
    index:0
  },
  onLoad(option) {
    let that = this;
    let list = getStorage('imgUrls') || null;
    if (list.length <= 0) {
      this.setData({
        isShow: false,
        kongShow: true
      })
    }
    this.setData({
      imgUrls: list,
      current: list.length - 1
    })
    // console.log("current:",list.length - 1)
    setStorage('imgUrls', list);
    let qqmapsdk = new QQMapWX({
      key: 'HUZBZ-ND7W4-MA4UY-X2QFA-XXT2V-BBBTX'
    });
    const { latitude, longitude } = getStorage('location') || {};
    qqmapsdk.reverseGeocoder({
      location: {
        latitude,
        longitude
      },
      success(res) {
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
  releaseFn() {//发布
    this.setData({
      clickflg: true
    })
    let that = this;
    wx.showLoading({ title: '正在上传图片...' })

    const { imgUrls, releaseValue } = this.data;
    this.upload({
      i: 0,
      url: 'https://www.xiaoxiaohb.com/street/file/upload',//这里是你图片上传的接口
      path: imgUrls//这里是选取的图片的地址数组 
    });
  },
  delFn(e) {
    const { index } = e.currentTarget.dataset;

    let list = this.data.imgUrls;
    
    list.splice(this.data.current, 1);
    if (list.length == 0) {
      current = -1;
    }
    let current = this.data.current - 1;


    if (list.length <= 0) {
      this.setData({
        isShow: false,
        kongShow: true
      })
    }

    this.setData({
      imgUrls: list,
      current
    })
    
    setStorage('imgUrls', list);
  },
  addFn() {
    const list = this.data.imgUrls;
    if (list.length >= 9) {
      wx.showModal({
        title: '',
        content: '最多添加9张图片',
        showCancel: false,
        success(res) { }
      })

    } else {
      wx.navigateTo({
        url: `/pages/tailor/tailor?index=0`
      })
    }


  },
  onShow() {

    let aShow = getStorage("aShow") || '';
    let inputvalue = getStorage('inputValue') || '';
    this.setData({
      releaseValue:inputvalue
    })
    this.checkValue()
    if (aShow) {

      // setStorage('aShow',true);
    }

  },
  addReleaseCon(e) {
    this.setData({
      releaseValue: e.detail.value
    })
    setStorage('inputValue',e.detail.value)
    this.checkValue()

  },
  checkValue() {
    if (this.data.releaseValue != '' && this.data.imgUrls.length >= 0) {
      this.setData({
        btnStatus: true
      })
    } else {
      this.setData({
        btnStatus: false
      })
    }
  },
  upload(data) {
    let that = this;
    // wx.showToast({
    //   icon: "loading",
    //   title: "正在上传"
    // })
    this.setData({
      btnStatus: false
    })

    var i = data.i ? data.i : 0,//当前上传的哪张图片
      success = data.success ? data.success : 0,//上传成功的个数
      fail = data.fail ? data.fail : 0;//上传失败的个数
    var zhongzhi = false;
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file',//这里根据自己的实际情况改
      formData: null,//这里是上传图片时一起上传的数据
      success: (resp) => {
        success++;//图片上传成功，图片上传成功的变量+1
        // console.log("resp:",resp)
        
        // console.log(i);
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
        var obj = JSON.parse(resp.data);//转换为json对象obj
        console.log("打印code的值:",obj.code)
        if(obj.code == 87014){
          wx.hideLoading()
          zhongzhi = true;
          wx.showModal({
            content: obj.message,
            showCancel:false,
            confirmText:'重新编辑',
            success (res) {
              if (res.confirm) {
                // console.log("有问题")
              }
            }
          })
        }else{
          if (obj.code == 0 || obj.code == 200) {
            wx.hideLoading()
            wx.showLoading({ title: `已上传${i+1}张图片` })
            let list = that.data.publishImages;
            list[i] = {};
            list[i].imageOrder = i;
            list[i].imageUrl = obj.data.imageUrl;
            // list.push(list[index]);
            that.setData({
              publishImages: list
            })
          }
          
        }
        
      },
      fail: (res) => {
        fail++;//图片上传失败，图片上传失败的变量+1
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '上传失败',
          showCancel: false
        })
      },
      complete: () => {
        
        // console.log(i);
        i++;//这个图片执行完上传后，开始上传下一张            
        if (i == data.path.length) {   //当图片传完时，停止调用  
          if(zhongzhi){
            return;
          }        
          // console.log('执行完毕');
          // console.log('成功：' + success + " 失败：" + fail);
          const { latitude, longitude } = getStorage('location') || {};
          const { cuserId } = getStorage('USER_INFO');
          let releaseValue = that.data.releaseValue;
          releaseValue = releaseValue.replace(/(^\s*)|(\s*$)/g, "");
          releaseService
            .publish({
              cuserId,
              content: releaseValue.split('\n').join('&hc'),
              latitude,
              longitude,
              location: this.data.address,
              publishImages: this.data.publishImages
            })
            .then(res => {
              // console.log('发布:', res)
              wx.hideLoading()
              if(!res){
                wx.showToast({
                  title: '发布成功',
                  icon: 'success'
                })
                setStorage('inputValue','')
                setTimeout(()=>{
                  setStorage("refresh","1");
                  wx.switchTab({
                    url: `/pages/index/index`
                  })
                },1500)
              }
              if (res.code == 87015) {
                wx.showModal({
                  content: res.message,
                  showCancel:false,
                  confirmText:'重新编辑',
                  success (res) {
                    if (res.confirm) {
                      // console.log('用户点击确定')
                    }
                  }
                })
              } 
              

            })
        } else {//若图片还没有传完，则继续调用函数 
          if(zhongzhi){
            return;
          }               
          // console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.upload(data);
        }
      }
    });

  },
  promiseCallBack() {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 2000, 'done');
    })
  },
  onUnload() {
    if (this.data.clickflg) {
      return;
    } else {
      wx.switchTab({
        url: `/pages/index/index`
      })

    }

  },
  cancelFn() {
    this.setData({
      isShowMod: false
    })
  },
  sureFn() {
    this.setData({
      isShowMod: false
    })
    wx.switchTab({
      url: `/pages/index/index`
    })

  }
})


