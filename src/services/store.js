import Request from '../utils/Request'  //获取请求模块

const { post, get } = new Request()  //实例化
const { getStorage, setStorage } = require('../utils/storage');

//获取好店列表
export const getStoreList = ({ latitude,longitude,distance,page,size}) => {
  //console.log(cityId, longitude, latitude )
  return post('https://www.xiaoxiaohb.com/street/shop/list', {
    data: {
      latitude,
      longitude,
      distance:2500,
      page,
      size
    }
  })
}



//获取好店详情
export const getStoreDetail = ({shopId}) => {
  //console.log(cityId, longitude, latitude )
  const {cuserId} = getStorage("USER_INFO") || {};
  const {longitude,latitude} = getStorage("location") || {};
  return post('https://www.xiaoxiaohb.com/street/shop/detail', {
    data: {
      shopId,
      cuserId,
      longitude,
      latitude
    }
  })
}


//获取好店详情
export const attentionFn = ({shopId,attention}) => {
  const {cuserId} = getStorage("USER_INFO") || {};
  return post('https://www.xiaoxiaohb.com/street/shop/attention', {
    data: {
      cuserId,
      shopId,
      attention
    }
  })
}


//获已关注注的门店列表
export const getAttentionList = ({page,size}) => {
  const {cuserId} = getStorage("USER_INFO") || {};
  const {longitude,latitude} = getStorage("location") || {};
  return post('https://www.xiaoxiaohb.com/street/shop/attentionlist', {
    data: {
      latitude,
      longitude,
      cuserId,
      page,
      size
    }
  })
}