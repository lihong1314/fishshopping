import Request from '../utils/Request'  //获取请求模块

const { post, get } = new Request()  //实例化
const { getStorage, setStorage } = require('../utils/storage');

//获取好店列表
export const getmine = ({cuserId}) => {
  // const { cuserId } = getStorage( 'USER_INFO' ) || {};
  return post('street/user/mine', {
    data: {
      cuserId
    }
  })
}

//var /street/user/mine2
export const getmine2 = ({cuserId,longitude,latitude}) => {
  // const { cuserId } = getStorage( 'USER_INFO' ) || {};
  if(longitude){
    return post('street/user/mine2', {
      data: {
        cuserId,
        longitude,
        latitude
      }
    })
  }else{
    return post('street/user/mine2', {
    data: {
      cuserId
    }
  })
  }
  
}

//获取收藏的淘贴列表
export const getMyCollection= ({cuserId,attentionId,page,size}) => {
  // const { cuserId } = getStorage( 'USER_INFO' ) || {};
  return post('street/home/collectionList', {
    data: {
      cuserId,
      attentionId,
      page,
      size
    }
  })
}


//获取用户的粉丝列表
export const getFansList=({cuserId,attentionId,page,size})=>{
  // const { cuserId } = getStorage( 'USER_INFO' ) || {};
  return post('street/home/fans', {
    data: {
      cuserId,
      attentionId,
      page,
      size
    }
  })
}


// 关注与取消粉丝
export const attentionFansOrCalcle=({fansId,attentionFans})=>{
  const { cuserId } = getStorage( 'USER_INFO' ) || {};
  return post('street/home/attentionFansOrCalcle', {
    data: {
      cuserId,
      fansId,
      attentionFans
    }
  })
}


// 获已关注注鱼苗列表
export const getAttentionList=({cuserId,attentionId,page,size})=>{
  // const { cuserId } = getStorage( 'USER_INFO' ) || {};
  return post('street/home/attentionList', {
    data: {
      cuserId,
      attentionId,
      page,
      size
    }
  })
}



// 关注鱼苗 和 取消关注 鱼苗
export const addOrCancleAttention=({cuserId,attentionId,attention})=>{
  
  return post('street/home/addOrCancleAttention', {
    data: {
      cuserId,
      attentionId,
      attention
    }
  })
}


// 18：用户头像修改
// url：/street/user/updateUserInfo
export const updateUserInfo=({cuserName,file})=>{
  const { cuserId } = getStorage( 'USER_INFO' ) || {};
  return post('street/user/updateUserInfo', {
    data: {
      cuserId,
      cuserName,
      file
    }
  })
}

//获取常见问题
export const questions=()=>{
  return post('street/mine/questions')
}


//获取鱼苗详情
export const attentionDetailList=({attentionId,page,size})=>{
  const { cuserId } = getStorage( 'USER_INFO' ) || {};
  return post('street/home/attentionDetailList', {
    data: {
      cuserId,
      attentionId,
      page,
      size
    }
  })
}



//获取我的淘贴列表
//street/home/publishList
export const getPublishListn= ({page,size}) => {
  const { cuserId } = getStorage( 'USER_INFO' ) || {};
  return post('street/home/publishList', {
    data: {
      cuserId,
      page,
      size
    }
  })
}

//删除我发布的淘贴
///street/home/canclePublish
export const canclePublish= ({publishId}) => {
  const { cuserId } = getStorage( 'USER_INFO' ) || {};
  return post('street/home/canclePublish', {
    data: {
      cuserId,
      publishId
    }
  })
}


// 获取二维码
///street/weixin/getToken
export const getQrCodeFn= () => {
  const { cuserId } = getStorage( 'USER_INFO' ) || {};
  return get('street/weixin/getToken', {
    data: {
      cuserId
    }
  })
}