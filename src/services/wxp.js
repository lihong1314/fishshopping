import promisefy from '../utils/promisify'

export const getLocation = promisefy(wx.getLocation)  //显示位置速度
export const showToast = promisefy(wx.showToast)    //显示消息提示框
export const showModal = promisefy(wx.showModal)   //显示模态窗口