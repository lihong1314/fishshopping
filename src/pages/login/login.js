const account = require('../../services/account.js');
require('./login.less');
const { getStorage, setStorage } = require('../../utils/storage');
Page({
  data: {
    mobile: '',
    verifyCode: '',
    sendCodeStatus: false,
    submitStatus: false,
    verifyTip: '获取验证码',
    error: ''
  },

  /**
   * 校验手机号码
   * @param params
   */
  checkMobile: params => /^1[34578]\d{9}$/.test(params.mobile),

  /**
   * 校验验证码
   * @param params
   */
  checkVerifyCode: params => params.verifyCode.toString().trim().length === 6,

  /**
   * 设置帐号信息
   * @param params
   */
  setAccountData(params) {
    params = {
      ...this.data,
      ...params
    }
    params = {
      ...params,
      submitStatus: this.checkMobile(params) && this.checkVerifyCode(params),
      sendCodeStatus: this.checkMobile(params)
    }
    this.setData(params)
  },

  /**
   * 电话输入框绑定事件
   * @param e
   */
  bindPhoneInput: function (e) {
    this.setAccountData({ mobile: e.detail.value })
  },

  /**
   * 验证码输入框绑定事件
   * @param e
   */
  bindCodeInput: function (e) {
    this.setAccountData({ verifyCode: e.detail.value })
  },

   /**
   * 提交表单
   * @param e
   */
  formSubmit: function (e) {
    this.bindAccountByCode(this.data).then(res => {
      console.log('formSubmit--response: ', res)
      setStorage( 'USER_INFO', res );
      wx.switchTab({
        url: '/pages/personal_n/personal_n'
      })
    }, err => {
      console.log('formSubmit--err-info: ', err)
    })
  },

  /**
   * 重置表单
   */
  formReset: function () {
    this.setData({
      mobile: '',
      verifyCode: '',
      sendCodeStatus: false,
      submitStatus: false,
    })
    console.log('-- reset --')
  },

  /**
   * todo....
   * 获取验证码
   * @return {*}
   */
  sendVerifyCode: function() {
    return account.sendVerifyCode(this.data.mobile).then(
      res => {
        var self = this
        self.setData({
          error:''
        })
        var countdown = 60;
        function settime() {
          if (countdown == 0) {
            self.setData({
              sendCodeStatus: true,
              verifyTip: '获取验证码'
            })
            countdown = 60;
            return;
          } else {
            countdown--;
            self.setData({
              sendCodeStatus: false,
              verifyTip: "重新获取("+countdown + "s)"
            })
          }
          setTimeout(function() {
            settime()
          }, 1000)
        }
        settime();
      }, res => {
        this.setData({
          error: res.message
        })
      },
      err => {
        console.log(err)
        this.setData({
          error: err
        })
      }
    )
  },

  /**
   * 动码绑定飞凡帐号
   * @return {Promise.<T>|*|Promise|Promise<any>}
   */
  bindAccountByCode: function () {
    return account.bindAccountByCode(this.data).then(res => {
      console.log(res)
      return res
    }).catch(err => {
      console.log(err)
    })
  },

  deletePhone: function() {
    this.setData({
      mobile: ''
    })
  },

  deleteCode: function() {
    this.setData({
      verifyCode: ''
    })
  },
  /*
  * 错误提示
  */
  hintError(){
    this.tipErr = this.selectComponent("#tipErr");//获取自定义组件 tip
    let errMsg=this.data.error;
    if(errMsg){
      this.setData({
        txt:errMsg,
        isShowMod:true
      })
      this.tipErr.hideTip();//调用组件tip的方法，实现2000s后隐藏组件
    }
  }
})
