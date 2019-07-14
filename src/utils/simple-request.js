import {Promise} from 'es6-promise'

const fixDomain = require('./domain').fixDomain
const promisify = require('./promisify')
const request = promisify(wx.request)

/**
 * 异步返回值的封装函数
 * @param params
 * @return {Promise.<*>|Promise<any>}
 */
const reject = params => {
  if (__DEV__) {
    console.error(`-- reject, params: ${JSON.stringify(params)}`)
  }
  return Promise.reject(params)
}

/**
 * 获取请求字符串
 * @param data
 * @return {string}
 */
const getQueryString = (data = {}) => Object.entries(data)
  .map(([key, val]) => `${key}=${encodeURI(val)}`).join('&')

/**
 * 判断对象是否为空
 * @param obj
 * @return {boolean}
 */
export const isEmpty = (obj = {}) => Object.keys(obj).length === 0

/**
 * 获取URL参数
 * @param params
 * @return {string}
 */
export const getURIParams = params => isEmpty(params) ? '' : `?${getQueryString(params)}`

/**
 * 通用 POST API 方法
 * @param url
 * @param data
 * @param options
 * @return {Promise}
 */
export const post = (url = '', data = {}, options = {}) => {
  if (!url.trim()) {
    return reject('-- The url of POST is empty')
  }

  return new Promise((resolve, reject) => {
    request({
      ...{
        url: fixDomain(url, __ENV__),
        method: 'POST',
        data,
        header: {
          'content-type': 'refundgoods_n/x-www-form-urlencoded'
        },
        ...options
      },
    }).then(res => {
      res = res['data']
      if (res['status'] === 200) {
        resolve(res['data'])
      } else {
        reject(res)
      }
    }, err => {
      reject(err)
    })
  })
}

/**
 * 通用 GET API 方法
 * @param url
 * @param data
 * @param options
 * @return {*}
 */
export const get = (url = '', data = {}, options = {}) => {
  if (!url.trim()) {
    return reject('-- The url of GET is empty')
  }

  return new Promise((resolve, reject) => {
    request({
      ...{
        url: fixDomain(url, __ENV__) + getURIParams(data),
        method: 'GET',
        data,
        ...options
      },
    }).then(res => {
      res = res['data']
      if (res['status'] === 200) {
        resolve(res['data'])
      } else {
        reject(res)
      }
    }, err => {
      reject(err)
    })
  })
}
