import Request from '../utils/Request'  //获取请求模块

const { post, get } = new Request()  //实例化
const { getStorage, setStorage } = require('../utils/storage');

//获取推荐淘贴列表
export const getRecommend = ({ latitude,longitude,distance,page,size}) => {
  const {cuserId} = getStorage("USER_INFO") || {};
  if(cuserId){
    return post('street/home/list', {
      data: {
        cuserId,
        latitude,
        longitude,
        distance,
        page,
        size
      }
    })
  }else{
    return post('street/home/list', {
      data: {
        latitude,
        longitude,
        distance,
        page,
        size
      }
    })
  }
  
}

//获取首页已关注列表
export const getInterestList = ({page,size}) => {
  const {cuserId} = getStorage("USER_INFO") || {};
  if(cuserId){
    return post('street/home/interestList', {
      data: {
        cuserId,
        page,
        size
      }
    })
  }else{
    return post('street/home/interestList', {
      data: {
        page,
        size
      }
    })
  }
  
}


//获取推荐淘贴详情
export const getRecommendDetail = ({ publishId}) => {
  const {cuserId} = getStorage("USER_INFO") || {};
  const {latitude,longitude} = getStorage('location') ||{};
  if(cuserId && latitude){
    
    return post('street/home/detail', {
      data: {
        cuserId,
        latitude,
        longitude,
        publishId
      }
    })
  }else if(latitude){
    return post('street/home/detail', {
      data: {
        publishId,
        latitude,
        longitude,
      }
    })
  }else{
    return post('street/home/detail', {
      data: {
        publishId,
      }
    })
  }
  
  
}


//收藏淘贴
export const chenkCollection = ({ publishId,collection}) => {
  const {cuserId} = getStorage("USER_INFO") || {};
  return post('street/home/collection', {
    data: {
      cuserId,
      publishId,
      collection
    }
  })
}



// 举报淘贴
export const report = ({publishId,reportContent,contact}) => {
  const {cuserId} = getStorage("USER_INFO") || {};
  return post('street/home/report', {
    data: {
      cuserId,
      publishId,
      reportContent,
      contact
    }
  })
}



// 校验用户是否可以发布
export const checkPublish = () => {
  const {cuserId} = getStorage("USER_INFO") || {};
  return post('street/home/checkPublish', {
    data: {
      cuserId
    }
  })
}



//新增接口
// 首页改附近用户列表接口(发现页面的用户列表)
export const getNearUsers = ({ latitude,longitude,page,size}) => {
  const {cuserId} = getStorage("USER_INFO") || {};
  if(cuserId){
    return post('street/home/nearUsers', {
      data: {
        cuserId,
        latitude,
        longitude,
        page,
        size
      }
    })
  }else{
    return post('street/home/nearUsers', {
      data: {
        latitude,
        longitude,
        page,
        size
      }
    })
  }
  
}