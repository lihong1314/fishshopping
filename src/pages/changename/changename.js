require('./changename.less');

const { getStorage, setStorage } = require('../../utils/storage');
import * as personalService from '../../services/personal';

Page({
  data:{
    img:'',
    name:'',
    cuserId:0
  },
  onShow(){
  },
  onLoad(option){
    // wx.showLoading({title:'加载中...'})
    const { cuserId } = getStorage( 'USER_INFO' ) || {};
    const {username} = option;
    this.setData({
      cuserId,
      name:username
    })
    
    
  },
  modifyNameFn(e){
    let value =  e.detail.value;
    
    this.setData({
     name:value
    })
   },
  saveFn(){
    const {name,cuserId}=this.data;
    if(name != ''){
      personalService
      .updateUserInfo({
        cuserName:this.data.name,
        file:''
      })
      .then(res=>{
        if(res.cUserName){
          const {access}=getStorage('USER_INFO')
          setStorage('USER_INFO',{
            avatarUrl:res.cUserIcon,
            nickName:res.cUserName,
            cuserId,
            access:access
          })
          wx.navigateTo({
            url:`/pages/information/information?name=${res.cUserName}`
          })
        }
        if (res.code == 87015) {
          wx.showModal({
            content: res.message,
            showCancel:false,
            confirmText:'重新编辑',
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        } 
        
      })
    }else{
      wx.showToast({title: '昵称不能为空'})
    }
  }
})