import Request from '../utils/Request'  //获取请求模块

const { post, get } = new Request()  //实例化
const { getStorage, setStorage } = require('../utils/storage');

//获取好店列表
export const getmine = ({cuserId}) => {
  // const { cuserId } = getStorage( 'USER_INFO' ) || {};
  return post('https://www.xiaoxiaohb.com/street/user/mine', {
    data: {
      cuserId
    }
  })
}

//var /street/user/mine2
export const getmine2 = ({cuserId,longitude,latitude}) => {
  // const { cuserId } = getStorage( 'USER_INFO' ) || {};
  if(longitude){
    return post('https://www.xiaoxiaohb.com/street/user/mine2', {
      data: {
        cuserId,
        longitude,
        latitude
      }
    })
  }else{
    return post('https://www.xiaoxiaohb.com/street/user/mine2', {
    data: {
      cuserId
    }
  })
  }
  
}

//获取收藏的淘贴列表
export const getMyCollection= ({cuserId,page,size}) => {
  // const { cuserId } = getStorage( 'USER_INFO' ) || {};
  return post('https://www.xiaoxiaohb.com/street/home/collectionList', {
    data: {
      cuserId,
      page,
      size
    }
  })
}


//获取用户的粉丝列表
export const getFansList=({cuserId,page,size})=>{
  // const { cuserId } = getStorage( 'USER_INFO' ) || {};
  return post('https://www.xiaoxiaohb.com/street/home/fans', {
    data: {
      cuserId,
      page,
      size
    }
  })
}


// 关注与取消粉丝
export const attentionFansOrCalcle=({fansId,attentionFans})=>{
  const { cuserId } = getStorage( 'USER_INFO' ) || {};
  return post('https://www.xiaoxiaohb.com/street/home/attentionFansOrCalcle', {
    data: {
      cuserId,
      fansId,
      attentionFans
    }
  })
}


// 获已关注注鱼苗列表
export const getAttentionList=({cuserId,page,size})=>{
  // const { cuserId } = getStorage( 'USER_INFO' ) || {};
  return post('https://www.xiaoxiaohb.com/street/home/attentionList', {
    data: {
      cuserId,
      page,
      size
    }
  })
}



// 关注鱼苗 和 取消关注 鱼苗
export const addOrCancleAttention=({cuserId,attentionId,attention})=>{
  
  return post('https://www.xiaoxiaohb.com/street/home/addOrCancleAttention', {
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
  return post('https://www.xiaoxiaohb.com/street/user/updateUserInfo', {
    data: {
      cuserId,
      cuserName,
      file
    }
  })
}

//获取常见问题
export const questions=()=>{
  return post('https://www.xiaoxiaohb.com/street/mine/questions')
}


//获取鱼苗详情
export const attentionDetailList=({attentionId,page,size})=>{
  const { cuserId } = getStorage( 'USER_INFO' ) || {};
  return post('https://www.xiaoxiaohb.com/street/home/attentionDetailList', {
    data: {
      // cuserId,
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
  return post('https://www.xiaoxiaohb.com/street/home/publishList', {
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
  return post('https://www.xiaoxiaohb.com/street/home/canclePublish', {
    data: {
      cuserId,
      publishId
    }
  })
}