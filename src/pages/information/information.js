require('./information.less');

const { getStorage, setStorage } = require('../../utils/storage');
import * as personalService from '../../services/personal';

Page({
  data:{
    img:'',
    name:'',
    cuserId:0,
    clickFlg:false
  },
  onShow(){
    let pages = getCurrentPages();
    console.log('pages:',pages);
   
  },
  onLoad(option){
    // wx.showLoading({title:'加载中...'})
    const { cuserId,avatarUrl,nickName } = getStorage( 'USER_INFO' ) || {};
    const {src,name} = option;
    if(src){
      this.setData({
        img:src,
        cuserId,
        name:name
      })
      this.saveFn()
    }else{
      this.setData({
        cuserId,
        img:avatarUrl,
        name:name
      })
    }
    
    
  },
  modifyFn(){
    wx.navigateTo({
      url: `/pages/tailor/tailor?index=2&name=${this.data.name}`
    })
  },
  modifyNameFn(e){
   let value =  e.detail.value;
   
   this.setData({
    name:value
   })
  },
  saveFn(){
    this.setData({
      clickFlg:false
    })
    const {name, img, cuserId}=this.data;
    let username = name;
    // const { cuserId,avatarUrl,nickName } = getStorage( 'USER_INFO' ) || {};
    console.log('name:',username)
    if(name != ''){
      wx.showToast({
        icon: "loading",
        title: "正在上传"
      })
      console.log("__DEV__:",__DEV__)
      let newUrl = __DEV__ ? `https://test-tao.xiaoxiaohb.com/`:`https://www.xiaoxiaohb.com/`;
      // let newUrl = __DEV__ ? `https://test-tao.xiaoxiaohb.me/`:`https://www.xiaoxiaohb.com/`;
      // let newUrl = `https://www.xiaoxiaohb.com/`;
      wx.uploadFile({
        url: newUrl+"street/user/updateUserInfo",
        filePath: img, 
        name: 'file',
        header: { "Content-Type": "multipart/form-data;charset=UTF-8" },
        formData: {
          'file':img,
          'cuserName':username,
          'cuserId':cuserId
        },
        success: function (res) {
          var obj = JSON.parse(res.data);//转换为json对象obj
         
          if(obj.code == 87014){
            wx.hideLoading()
            wx.showModal({
              content: obj.message,
              showCancel:false,
              confirmText:'重新编辑',
              success (res) {
                if (res.confirm) {
                  console.log("有问题")
                }
              }
            })
          }else{
            if (obj.code == 0 || obj.code == 200) { 
              console.log('res',obj.data);

              const {access}=getStorage('USER_INFO')
              setStorage('USER_INFO',{
                avatarUrl:obj.data.cUserIcon,
                nickName:obj.data.cUserName,
                cuserId,
                access:access
              })
              wx.showToast({title: '保存成功'})
            }
          }
          
          
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
      
    }else{
      wx.showToast({title: '昵称不能为空'})
    }
  },
  onUnload(){
    const {clickFlg} = this.data;
    
    if(!clickFlg){
      this.setData({
        clickFlg:true
      })
      wx.switchTab({
        url: `/pages/personal/personal`
      })
    }else{
      return;
    }
    
    
  },
  gotoChangeName(){
    wx.navigateTo({
      url:`/pages/changename/changename?username=${this.data.name}`
    })
  }
})