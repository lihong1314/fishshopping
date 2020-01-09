
const promisify = require('../utils/promisify')
// const fixDomain = require('../utils/domain').fixDomain

const login = promisify(wx.login)
const checkSession = promisify(wx.checkSession)
import Request from '../utils/Request'
const { post, get } = new Request()


/** 从相册中选取图片
 * 
 * 
 */

export const getImage = ()=>new Promise(( resolve, reject )=>{
  
    wx.chooseImage({
      count:1,
      sizeType:['compressed'],
      sourceType:['album', 'camera'],
      success(res){
        console.log('哈哈')
        resolve({
          res
        })

      },
      fail(){
        
        reject()
      }
    })

  
})

//发布
export const publish = ({cuserId,content,latitude,longitude,location,publishImages})=>{
  
  return post(`street/home/publish`,{
    formJson:true,
    data:{
      cuserId,content,latitude,longitude,location,publishImages
    }
  })
}


