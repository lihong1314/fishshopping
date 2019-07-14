
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
      sizeType:"original",
      sourceType:'album',
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

    // wx.chooseMessageFile({
    //   count: 10,
    //   type: 'image',
    //   success (res) {
    //     // tempFilePath可以作为img标签的src属性显示图片
    //     const tempFilePaths = res.tempFilePaths
    //     resolve({res})
    //   },
    //   fail(){
    //     reject()
    //   }
    // })
  
})

//发布
export const publish = ({cuserId,content,latitude,longitude,location,publishImages})=>{
  
  return post(`https://www.xiaoxiaohb.com/street/home/publish`,{
    formJson:true,
    data:{
      cuserId,content,latitude,longitude,location,publishImages
    }
  })
}


