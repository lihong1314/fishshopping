const setStorage = ( key, value ) => {
    try{
      wx.setStorageSync( key, value )    //设置同步缓存
    } catch (e) {
    }
}


const getStorage = ( key ) => {
  try {
    const value = wx.getStorageSync( key );   //同步取出缓存中指定的key值
    if( value ) return value;
  } catch (e) {
  }
}
  
module.exports = {
  setStorage,
  getStorage,
}
