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

function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

module.exports = {
  formatTime: formatTime,
  formatTimeM:formatTimeM,
  formatNumber:formatNumber,
  formatUrl: formatUrl,
  checkLogin,
  compareVersion:compareVersion,
  message
}
