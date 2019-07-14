import Request from '../utils/Request'  //获取请求模块

const { post, get } = new Request()  //实例化

export const getPlazas = ({ cityId, longitude, latitude }) => {
  //console.log(cityId, longitude, latitude )
  return get('https://api.sit.ffan.com/wechatxmt/v1/plazas', {
    data: {
      cityId,
      lng: longitude,
      lat: latitude
    }
  })
}

export const getStores = ({ plazaId, longitude, latitude }) => {
  return get('https://api.sit.ffan.com/shopin/v1/stores', {
    data: {
      plazaId,
      lng: longitude,
      lat: latitude
    }
  })
}

export const getCities = () => {
  return get('https://api.sit.ffan.com/wechatxmt/v1/cities')
}

export const location = (latitude, longitude) => {
  return get('https://api.sit.ffan.com/wechatxmt/v1/location', {
    data: {
      lng: longitude,
      lat: latitude
    }
  })
}
