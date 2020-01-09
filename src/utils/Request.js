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
            let newUrl ='';
            if(__DEV__){
              newUrl = `https://test-tao.xiaoxiaohb.com/${url}`
            }else{
              newUrl = `https://www.xiaoxiaohb.com/${url}`;
            }
            
            const options = {
              // url: fixDomain(url, __ENV__),
              url: newUrl,
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
                }else if( code == 87014 || code == 87015){ //87015输入的内容有问题不逾通过，87014图片有问题
                  resolve({ code, data, message })
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




