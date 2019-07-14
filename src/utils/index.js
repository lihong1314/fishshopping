const { getStorage, setStorage } = require('./storage');

function formatUrl(url) {
  return url
}
function formatTime(timestamp) {
	 var   date=new  Date(timestamp*1000);
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('.') + ' ' + [hour, minute].map(formatNumber).join(':')
}
function formatTimeM(timestamp) {
 var date=new  Date(timestamp);
 var year = date.getFullYear()
 var month = date.getMonth() + 1
 var day = date.getDate()

 var hour = date.getHours()
 var minute = date.getMinutes()
 var second = date.getSeconds()


 return `${month}月${day}日`
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function checkLogin() {
  const { uid: memberId } = getStorage( 'USER_INFO' ) || {};
  if( !memberId ){
    wx.showModal( { title:  '', showCancel: true, 'content': '请先登录', success: ( opt ) => {
      if( opt.confirm ) wx.navigateTo({url: '/pages/loginmode/loginmode'})
    },fail: ()=>{
  
    } } )
  }
}

function message( msg ) {
  wx.showModal( { title:  '', showCancel: false, 'content': msg, success: () => {
  
  } } )
}

module.exports = {
  formatTime: formatTime,
  formatTimeM:formatTimeM,
  formatNumber:formatNumber,
  formatUrl: formatUrl,
  checkLogin,
  message
}
