import { Promise } from 'es6-promise'
const fixDomain = require('./domain').fixDomain

const promisify = require('./promisify')
const request = promisify(wx.request)

const methods = ['get', 'post', 'put', 'patch', 'del']

class Request {
  constructor() {
    methods.forEach(
      method =>
        this[method] = (
          url,
          { data, formEncoding = true, formJson, auth } = {}
        ) =>
          new Promise((resolve, reject) => {
            const options = {
              // url: fixDomain(url, __ENV__),
              url: url,
              data,
              method,
              header: {}
            }
            
            const { header } = options
            if (formEncoding) {
              header['Content-Type'] = 'application/x-www-form-urlencoded'
            }
            if (formJson) {
              // header['Content-Type'] = 'refundgoods_n/json';
              // header['Accept'] = 'refundgoods_n/json'
              header['Content-Type'] = 'application/json';
              header['Accept'] = '*/*'
              
            }
            request(options).then(
              ({ data: { code, data, message } }) => {
                if (code == 200 || code==0) {
                  // console.log(data)
                  resolve( data )
                } else {
                  reject( data || `${status},${ message || ''}` )
                }
              },
              err => reject(err)
            )
          })
    )
  }
}

export default Request




