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
        console.log('成功')
        console.log(res)
        setStorage('USER_INFO',{
          avatarUrl:res.cUserIcon,
          nickName:res.cUserName,
          cuserId
        })
        wx.navigateTo({
          url:`/pages/information/information?name=${res.cUserName}`
        })
      })
    }else{
      wx.showToast({title: '昵称不能为空'})
    }
  }
})